import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

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

// Max duration for serverless function (Fal.ai image generation can take time)
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return NextResponse.json({ error: "FAL_KEY nicht gesetzt." }, { status: 500 });
  }

  // Configure credentials per-request to ensure env var is available
  fal.config({ credentials: falKey });

  console.log("[v0] FAL_KEY present, length:", falKey.length, "starts with:", falKey.slice(0, 8) + "...");

  try {
    const formDataIn = await req.formData();
    const file = formDataIn.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Kein Bild hochgeladen." }, { status: 400 });
    }

    const photoType = (formDataIn.get("photoType") as string) || "biometric";
    const prompt = photoType === "lebenslauf" ? LEBENSLAUF_PROMPT : BIOMETRIC_PROMPT;

    console.log("[v0] Photo type:", photoType);
    console.log("[v0] File size:", Math.round(file.size / 1024), "KB, type:", file.type);

    // Upload the image to Fal storage to get a URL
    const imageUrl = await fal.storage.upload(file);
    console.log("[v0] Image uploaded to Fal storage:", imageUrl);

    // Use Flux 2 Flash Edit for image-to-image processing
    const result = await fal.subscribe("fal-ai/flux-2/flash/edit", {
      input: {
        prompt,
        image_urls: [imageUrl],
        guidance_scale: 3.5,
        image_size: "square_hd",
        num_images: 1,
        output_format: "png",
        enable_safety_checker: false,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach((msg) => console.log("[v0] Fal progress:", msg));
        }
      },
    });

    console.log("[v0] Fal result received. Keys:", Object.keys(result.data));

    const images = result.data.images as Array<{ url: string }> | undefined;
    const generatedImageUrl = images?.[0]?.url;

    if (!generatedImageUrl) {
      console.log("[v0] No image in result:", JSON.stringify(result.data).slice(0, 500));
      return NextResponse.json(
        { error: "Kein Bild in der Antwort gefunden. Bitte erneut versuchen." },
        { status: 502 }
      );
    }

    console.log("[v0] Generated image URL:", generatedImageUrl.slice(0, 100));
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
