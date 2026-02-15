import { NextRequest, NextResponse } from "next/server";

/* ───────────────────────────── Prompts ───────────────────────────── */

const BIOMETRIC_PROMPT =
  "Edit this photo to create a professional German biometric passport photo. Keep the exact same person and face. Remove all facial hair completely, make the face clean-shaven. Put the person in a dark navy suit jacket with a white dress shirt and dark tie. Change the background to a solid plain light grey with no shadows. Apply soft even studio lighting. The person should have a neutral expression, mouth closed, eyes open, looking straight at camera. Center the head, passport crop framing. Photorealistic, 8k resolution, sharp focus.";

const LEBENSLAUF_PROMPT =
  "Edit this photo to create a professional German business headshot for a CV. Keep the exact same person and face, keep all facial hair exactly as-is. Put the person in a dark navy suit jacket with a white dress shirt and dark tie. Change the background to a clean neutral soft grey gradient. Apply soft flattering studio lighting. The person should have a friendly confident expression with a slight smile, eyes open, looking at camera. Head and shoulders framing. Photorealistic, 8k resolution, sharp focus.";

/* ────────────────────────── API Handler ──────────────────────────── */

export const maxDuration = 120;

const FAL_QUEUE_URL = "https://queue.fal.run/fal-ai/nano-banana-pro/edit";

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
      "[v0] Submitting to nano-banana-pro/edit | type:",
      photoType,
      "| size:",
      Math.round(arrayBuffer.byteLength / 1024),
      "KB"
    );

    // Step 1: Submit to queue
    const submitRes = await fetch(FAL_QUEUE_URL, {
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
        resolution: "2K",
        output_format: "png",
        safety_tolerance: "6",
      }),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      console.error("[v0] Fal submit error:", submitRes.status, errText);
      return NextResponse.json(
        { error: `Fal.ai Fehler (${submitRes.status}): ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const submitData = await submitRes.json();
    console.log("[v0] Submit response:", JSON.stringify(submitData).slice(0, 200));

    // If result came back immediately
    if (submitData.images?.[0]?.url) {
      return NextResponse.json({ image: submitData.images[0].url });
    }

    const requestId = submitData.request_id;
    if (!requestId) {
      console.error("[v0] No request_id:", JSON.stringify(submitData).slice(0, 300));
      return NextResponse.json(
        { error: "Keine Request-ID von Fal.ai erhalten." },
        { status: 502 }
      );
    }

    console.log("[v0] Queued, request_id:", requestId);

    // Step 2: Poll for completion (every 2s, max ~3 min)
    const statusBaseUrl = `https://queue.fal.run/fal-ai/nano-banana-pro/edit/requests/${requestId}`;

    for (let i = 0; i < 90; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const statusRes = await fetch(`${statusBaseUrl}/status`, {
        headers: { Authorization: `Key ${falKey}` },
      });

      if (!statusRes.ok) {
        console.error("[v0] Poll error:", statusRes.status);
        continue;
      }

      const statusData = await statusRes.json();
      console.log("[v0] Poll #" + (i + 1), "status:", statusData.status);

      if (statusData.status === "COMPLETED") {
        // Step 3: Fetch result
        const resultRes = await fetch(statusBaseUrl, {
          headers: { Authorization: `Key ${falKey}` },
        });

        if (!resultRes.ok) {
          const errText = await resultRes.text();
          console.error("[v0] Result fetch error:", errText);
          return NextResponse.json(
            { error: "Ergebnis konnte nicht abgerufen werden." },
            { status: 502 }
          );
        }

        const resultData = await resultRes.json();
        const imageUrl = resultData.images?.[0]?.url;

        if (!imageUrl) {
          console.error("[v0] No image in result:", JSON.stringify(resultData).slice(0, 300));
          return NextResponse.json(
            { error: "Kein Bild im Ergebnis." },
            { status: 502 }
          );
        }

        console.log("[v0] Done! Image URL:", imageUrl.slice(0, 80));
        return NextResponse.json({ image: imageUrl });
      }

      if (statusData.status === "FAILED") {
        console.error("[v0] Job failed:", JSON.stringify(statusData).slice(0, 300));
        return NextResponse.json(
          { error: "Bildgenerierung fehlgeschlagen." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: "Zeitlimit ueberschritten." },
      { status: 504 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[v0] Unexpected error:", message);
    return NextResponse.json(
      { error: `Fehler bei der Bildverarbeitung: ${message}` },
      { status: 500 }
    );
  }
}
