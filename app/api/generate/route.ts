import { NextRequest, NextResponse } from "next/server";

/* ───────────────────────────── Prompts ───────────────────────────── */

const IDENTITY_RULES = [
  "ABSOLUTE PRIORITY - FACE IDENTITY PRESERVATION:",
  "The output face MUST be the EXACT SAME person as the input.",
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
  "If the person has any facial hair (beard, mustache, goatee, stubble), completely remove it.",
  "The face must be perfectly clean-shaven. Show the natural skin underneath.",
  "",
  "HAIR: Gently neaten the existing hairstyle. Keep the exact same hair color, length, and general style.",
  "CLOTHING: Add a dark navy formal suit jacket, white dress shirt with collar, and a dark tie.",
  "BACKGROUND: Plain uniform light gray background. No shadows, no gradients.",
  "LIGHTING: Soft, even studio lighting. Natural skin tones. No harsh shadows.",
  "FRAMING: Head centered, face fills 70-80% of height, straight posture, passport crop.",
  "EXPRESSION: Neutral expression. Mouth closed, eyes open, looking directly at camera.",
  "Photorealistic output. No artistic filters.",
].join("\n");

const LEBENSLAUF_PROMPT = [
  "Transform this person's photo into a professional German Bewerbungsfoto (application/CV photo).",
  "",
  IDENTITY_RULES,
  "- Exact same facial hair pattern - keep the beard exactly as-is if present.",
  "",
  "HAIR: Gently neaten the existing hairstyle. Keep the exact same hair color, length, and general style.",
  "CLOTHING: Add a dark navy formal suit jacket, white dress shirt with collar, and a dark tie.",
  "BACKGROUND: Clean, neutral soft gradient background. Professional studio look.",
  "LIGHTING: Soft, flattering studio lighting with gentle fill. Natural skin tones.",
  "FRAMING: Professional headshot crop - head and shoulders, face fills about 60% of frame.",
  "EXPRESSION: Keep natural expression. A slight, confident smile is ideal. Eyes open, looking at camera.",
  "Photorealistic output. No artistic filters.",
].join("\n");

/* ────────────────────────── API Handler ──────────────────────────── */

export const maxDuration = 120;

// Direct synchronous endpoint — simpler and more reliable than the queue
const FAL_RUN_URL = "https://fal.run/fal-ai/flux/dev/image-to-image";

export async function POST(req: NextRequest) {
  const rawKey = process.env.FAL_KEY;
  if (!rawKey) {
    return NextResponse.json(
      { error: "FAL_KEY nicht gesetzt." },
      { status: 500 }
    );
  }

  // Trim whitespace/newlines that may have been pasted with the key
  const falKey = rawKey.trim();

  console.log("[v0] FAL_KEY debug — length:", falKey.length, "| first 10 chars:", JSON.stringify(falKey.slice(0, 10)), "| last 5 chars:", JSON.stringify(falKey.slice(-5)), "| contains colon:", falKey.includes(":"));

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Kein Bild hochgeladen." },
        { status: 400 }
      );
    }

    const photoType = (formData.get("photoType") as string) || "biometric";
    const prompt =
      photoType === "lebenslauf" ? LEBENSLAUF_PROMPT : BIOMETRIC_PROMPT;

    // Convert image to base64 data URI — fal.ai accepts this directly
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64}`;

    console.log(
      "[v0] Submitting to Fal.ai | type:",
      photoType,
      "| size:",
      Math.round(arrayBuffer.byteLength / 1024),
      "KB"
    );

    // Use the direct synchronous fal.run endpoint with image_url + strength
    // strength 0.35 = preserve the original face strongly, only adjust styling
    const response = await fetch(FAL_RUN_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_url: dataUri,
        strength: 0.4,
        image_size: { width: 900, height: 1200 },
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: "png",
        enable_safety_checker: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[v0] Fal.ai error:", response.status, errText);
      return NextResponse.json(
        {
          error: `Fal.ai Fehler (${response.status}): ${errText.slice(0, 200)}`,
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("[v0] Fal.ai response keys:", Object.keys(data));

    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) {
      console.error(
        "[v0] No image in result:",
        JSON.stringify(data).slice(0, 300)
      );
      return NextResponse.json(
        { error: "Kein Bild im Ergebnis." },
        { status: 502 }
      );
    }

    console.log("[v0] Done! Image URL:", imageUrl.slice(0, 80));
    return NextResponse.json({ image: imageUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[v0] Unexpected error:", message);
    return NextResponse.json(
      { error: `Fehler bei der Bildverarbeitung: ${message}` },
      { status: 500 }
    );
  }
}
