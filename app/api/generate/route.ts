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

const FAL_QUEUE_URL = "https://queue.fal.run/fal-ai/flux-2/flash/edit";

export async function POST(req: NextRequest) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return NextResponse.json(
      { error: "FAL_KEY nicht gesetzt." },
      { status: 500 }
    );
  }

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

    // Convert image to base64 data URI (fal.ai accepts this directly in image_urls)
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

    // Submit to fal.ai queue with base64 data URI
    const submitRes = await fetch(FAL_QUEUE_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_urls: [dataUri],
        image_size: { width: 900, height: 1200 },
        num_images: 1,
        guidance_scale: 3.5,
        output_format: "png",
        enable_safety_checker: false,
        enable_prompt_expansion: false,
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
    console.log("[v0] Submit response keys:", Object.keys(submitData));

    // If the result came back immediately (sync)
    if (submitData.images?.[0]?.url) {
      console.log("[v0] Got sync result");
      return NextResponse.json({ image: submitData.images[0].url });
    }

    // Otherwise we got a queued request — poll for completion
    const requestId = submitData.request_id;
    if (!requestId) {
      console.error("[v0] No request_id in response:", JSON.stringify(submitData).slice(0, 300));
      return NextResponse.json(
        { error: "Keine Request-ID von Fal.ai erhalten." },
        { status: 502 }
      );
    }

    console.log("[v0] Queued, request_id:", requestId);

    const statusUrl = `${FAL_QUEUE_URL}/requests/${requestId}/status`;
    const resultUrl = `${FAL_QUEUE_URL}/requests/${requestId}`;

    // Poll every 2s, max ~3 min
    for (let i = 0; i < 90; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const statusRes = await fetch(statusUrl, {
        headers: { Authorization: `Key ${falKey}` },
      });

      if (!statusRes.ok) {
        console.error("[v0] Poll error:", statusRes.status);
        continue;
      }

      const statusData = await statusRes.json();
      console.log("[v0] Poll #" + (i + 1), "status:", statusData.status);

      if (statusData.status === "COMPLETED") {
        const resultRes = await fetch(resultUrl, {
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
