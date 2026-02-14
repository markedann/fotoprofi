import { NextRequest, NextResponse } from "next/server";

/* ───────────────────────────── Prompts ───────────────────────────── */

const BIOMETRIC_PROMPT =
  "Transform this selfie into a professional German biometric passport photo. Same person, same face, same eyes, same skin tone. Remove all facial hair completely, clean shaven. Wearing dark navy suit jacket, white dress shirt, dark tie. Solid plain light grey background with no shadows. Soft even studio lighting. Neutral expression, mouth closed, eyes open, looking straight at camera. Head centered, passport crop framing. Photorealistic photograph, not illustration, not painting, not anime. 8k resolution, sharp focus, studio quality.";

const LEBENSLAUF_PROMPT =
  "Transform this selfie into a professional German business headshot for a CV. Same person, same face, same eyes, same skin tone. Keep all facial hair exactly as-is. Wearing dark navy suit jacket, white dress shirt, dark tie. Clean neutral soft grey gradient background. Soft flattering studio lighting. Friendly confident expression, slight smile, eyes open, looking at camera. Head and shoulders framing. Photorealistic photograph, not illustration, not painting, not anime. 8k resolution, sharp focus, studio quality.";

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

  // Strip any leading dots, whitespace, or invisible chars that got pasted with the key
  const falKey = rawKey.trim().replace(/^[.\s]+/, "").replace(/[.\s]+$/, "");

  console.log("[v0] FAL_KEY debug — length:", falKey.length, "| first 10 chars:", JSON.stringify(falKey.slice(0, 10)), "| last 5 chars:", JSON.stringify(falKey.slice(-5)));

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

    // strength 0.65 = enough to transform background, clothing, lighting
    // guidance_scale 7.0 = strongly follow the prompt for photorealism
    const response = await fetch(FAL_RUN_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_url: dataUri,
        strength: 0.65,
        image_size: { width: 900, height: 1200 },
        num_inference_steps: 40,
        guidance_scale: 7.0,
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
