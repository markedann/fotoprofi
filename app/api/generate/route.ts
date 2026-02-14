import { NextRequest, NextResponse } from "next/server";

const IDENTITY_RULES = [
  "ABSOLUTE PRIORITY - FACE IDENTITY PRESERVATION:",
  "This is the MOST IMPORTANT rule. The output face MUST be the EXACT SAME person as the input. Every single facial feature must be preserved with pixel-level accuracy:",
  "- Exact same eye shape, eye color, eye spacing, and eye size",
  "- Exact same nose shape, nose width, and nose bridge",
  "- Exact same mouth shape and lip thickness",
  "- Exact same jawline, chin shape, and face width",
  "- Exact same forehead shape and size",
  "- Exact same skin tone, skin texture, moles, wrinkles, and marks",
  "- Exact same eyebrow shape and thickness",
  "If the output face does not look like the same person, the result is a FAILURE.",
].join("\n");

const BIOMETRIC_PROMPT = [
  "Transform this person's photo into a German biometric passport photo (35x45mm format).",
  "",
  IDENTITY_RULES,
  "",
  "FACIAL HAIR - MANDATORY REMOVAL:",
  "If the person has any facial hair (beard, mustache, goatee, stubble, any facial hair at all), completely remove it. The face must be perfectly clean-shaven. Show the natural skin underneath. The chin, jawline, upper lip, and cheeks must be completely smooth and hair-free.",
  "",
  "HAIR: Gently neaten the existing hairstyle. Keep the exact same hair color, length, and general style.",
  "",
  "CLOTHING: Add a dark navy formal suit jacket, white dress shirt with collar, and a dark tie. Only shoulders and upper chest visible.",
  "",
  "BACKGROUND: Plain uniform light gray background. No shadows, no gradients.",
  "",
  "LIGHTING: Soft, even studio lighting. Natural skin tones. No harsh shadows.",
  "",
  "FRAMING: Head centered, face fills 70-80% of height, straight posture, passport crop.",
  "",
  "EXPRESSION: Neutral expression. Mouth closed, eyes open, looking directly at camera.",
  "",
  "Photorealistic output. No artistic filters.",
].join("\n");

const LEBENSLAUF_PROMPT = [
  "Transform this person's photo into a professional German Bewerbungsfoto (application/CV photo).",
  "",
  IDENTITY_RULES,
  "- Exact same facial hair pattern - keep the beard exactly as-is if present.",
  "",
  "HAIR: Gently neaten the existing hairstyle. Keep the exact same hair color, length, and general style.",
  "",
  "CLOTHING: Add a dark navy formal suit jacket, white dress shirt with collar, and a dark tie. Only shoulders and upper chest visible.",
  "",
  "BACKGROUND: Clean, neutral soft gradient background. Very subtle light gray to slightly darker gray. Professional studio look.",
  "",
  "LIGHTING: Soft, flattering studio lighting with gentle fill. Natural skin tones. Subtle catchlights in eyes.",
  "",
  "FRAMING: Professional headshot crop - head and shoulders, face fills about 60% of frame, centered.",
  "",
  "EXPRESSION: Keep the natural expression. A slight, confident, friendly smile is ideal. Eyes open, looking at camera.",
  "",
  "Photorealistic output. No artistic filters.",
].join("\n");

export const maxDuration = 120;

const FAL_QUEUE_URL = "https://queue.fal.run/fal-ai/flux-2/flash/edit";
const FAL_UPLOAD_URL = "https://fal.run/fal-ai/storage/upload/initiate";

async function uploadToFalStorage(file: File, falKey: string): Promise<string> {
  // Step 1: Initiate upload
  const initiateRes = await fetch(FAL_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_name: file.name || "photo.jpg",
      content_type: file.type || "image/jpeg",
    }),
  });

  if (!initiateRes.ok) {
    const errText = await initiateRes.text();
    console.log("[v0] Upload initiate failed:", initiateRes.status, errText);
    throw new Error(`Fal upload initiate failed: ${initiateRes.status}`);
  }

  const { upload_url, file_url } = await initiateRes.json();
  console.log("[v0] Upload URL received, file_url:", file_url);

  // Step 2: Upload file to the presigned URL
  const arrayBuffer = await file.arrayBuffer();
  const uploadRes = await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/jpeg" },
    body: arrayBuffer,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    console.log("[v0] File upload failed:", uploadRes.status, errText);
    throw new Error(`Fal file upload failed: ${uploadRes.status}`);
  }

  console.log("[v0] File uploaded successfully to:", file_url);
  return file_url;
}

async function submitAndPoll(
  imageUrl: string,
  prompt: string,
  falKey: string
): Promise<string> {
  // Submit to queue
  const submitRes = await fetch(FAL_QUEUE_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_urls: [imageUrl],
      guidance_scale: 3.5,
      image_size: "square_hd",
      num_images: 1,
      output_format: "png",
      enable_safety_checker: false,
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    console.log("[v0] Queue submit failed:", submitRes.status, errText);
    throw new Error(`Fal queue submit failed (${submitRes.status}): ${errText}`);
  }

  const { request_id, status: initialStatus, response_url } = await submitRes.json();
  console.log("[v0] Queue submitted, request_id:", request_id, "status:", initialStatus);

  // If already completed
  if (initialStatus === "COMPLETED" && response_url) {
    const resultRes = await fetch(response_url, {
      headers: { Authorization: `Key ${falKey}` },
    });
    const resultData = await resultRes.json();
    return resultData.images?.[0]?.url;
  }

  // Poll for result
  const statusUrl = `https://queue.fal.run/fal-ai/flux-2/flash/edit/requests/${request_id}/status`;
  const resultUrl = `https://queue.fal.run/fal-ai/flux-2/flash/edit/requests/${request_id}`;

  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const statusRes = await fetch(statusUrl, {
      headers: { Authorization: `Key ${falKey}` },
    });

    if (!statusRes.ok) {
      console.log("[v0] Status poll error:", statusRes.status);
      continue;
    }

    const statusData = await statusRes.json();
    console.log("[v0] Poll #" + (i + 1) + " status:", statusData.status);

    if (statusData.status === "COMPLETED") {
      const resultRes = await fetch(resultUrl, {
        headers: { Authorization: `Key ${falKey}` },
      });

      if (!resultRes.ok) {
        const errText = await resultRes.text();
        throw new Error(`Fal result fetch failed: ${resultRes.status} ${errText}`);
      }

      const resultData = await resultRes.json();
      const generatedUrl = resultData.images?.[0]?.url;
      if (!generatedUrl) {
        throw new Error("No image in Fal response");
      }
      return generatedUrl;
    }

    if (statusData.status === "FAILED") {
      throw new Error("Fal processing failed: " + (statusData.error || "Unknown error"));
    }
  }

  throw new Error("Fal processing timed out after 4 minutes");
}

export async function POST(req: NextRequest) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return NextResponse.json({ error: "FAL_KEY nicht gesetzt." }, { status: 500 });
  }

  console.log("[v0] FAL_KEY present, length:", falKey.length);

  try {
    const formDataIn = await req.formData();
    const file = formDataIn.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Kein Bild hochgeladen." }, { status: 400 });
    }

    const photoType = (formDataIn.get("photoType") as string) || "biometric";
    const prompt = photoType === "lebenslauf" ? LEBENSLAUF_PROMPT : BIOMETRIC_PROMPT;

    console.log("[v0] Photo type:", photoType, "File size:", Math.round(file.size / 1024), "KB");

    // Step 1: Upload image to Fal storage
    const imageUrl = await uploadToFalStorage(file, falKey);

    // Step 2: Submit for processing and poll for result
    const generatedImageUrl = await submitAndPoll(imageUrl, prompt, falKey);

    console.log("[v0] Success! Generated image URL:", generatedImageUrl.slice(0, 80));
    return NextResponse.json({ image: generatedImageUrl });
  } catch (error) {
    console.error("[v0] Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Fehler bei der Bildverarbeitung: " + message },
      { status: 500 }
    );
  }
}
