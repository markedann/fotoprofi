import { NextRequest, NextResponse } from "next/server";

/* ───────────────────────────── Prompts ───────────────────────────── */

const BIOMETRIC_PROMPT =
  "Edit this photo to create a professional German biometric passport photo. Keep the exact same person and face. Remove all facial hair completely, make the face clean-shaven. Put the person in a dark navy suit jacket with a white dress shirt and dark tie. Change the background to a solid plain light grey with no shadows. Apply soft even studio lighting. The person should have a neutral expression, mouth closed, eyes open, looking straight at camera. Center the head, passport crop framing. Photorealistic, 8k resolution, sharp focus.";

const LEBENSLAUF_PROMPT =
  "Edit this photo to create a professional German business headshot for a CV. Keep the exact same person and face, keep all facial hair exactly as-is. Put the person in a dark navy suit jacket with a white dress shirt and dark tie. Change the background to a clean neutral soft grey gradient. Apply soft flattering studio lighting. The person should have a friendly confident expression with a slight smile, eyes open, looking at camera. Head and shoulders framing. Photorealistic, 8k resolution, sharp focus.";

/* ────────────────────────── API Handler ──────────────────────────── */

export const maxDuration = 300;

const FAL_RUN_URL = "https://fal.run/fal-ai/nano-banana-pro/edit";

export async function POST(req: NextRequest) {
  const rawKey = process.env.FAL_KEY;
  if (!rawKey) {
    return NextResponse.json(
      { error: "FAL_KEY nicht gesetzt." },
      { status: 500 }
    );
  }

  const falKey = rawKey.trim().replace(/^[.\s]+/, "").replace(/[.\s]+$/, "");

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

    // Convert image to base64 data URI -- fal.ai accepts this in image_urls
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64}`;

    console.log(
      "[v0] Submitting to nano-banana-pro/edit (sync) | type:",
      photoType,
      "| size:",
      Math.round(arrayBuffer.byteLength / 1024),
      "KB"
    );

    // Synchronous call -- fal.run returns the result directly (no queue polling)
    const response = await fetch(FAL_RUN_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_urls: [dataUri],
        num_images: 1,
        aspect_ratio: "3:4",
        resolution: "1K",
        output_format: "png",
        safety_tolerance: "6",
        sync_mode: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[v0] Fal.ai error:", response.status, errText);
      return NextResponse.json(
        { error: `Fal.ai Fehler (${response.status}): ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("[v0] Response keys:", Object.keys(data));

    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) {
      console.error("[v0] No image in result:", JSON.stringify(data).slice(0, 300));
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
