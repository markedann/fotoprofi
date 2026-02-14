import { NextRequest, NextResponse } from "next/server";

const PROMPT = [
  "You are a professional photo retoucher. Your task: take this person's photo and create a German biometric passport photo (35x45mm).",
  "",
  "ABSOLUTE PRIORITY - FACE IDENTITY PRESERVATION:",
  "This is the MOST IMPORTANT rule. The output face MUST be the EXACT SAME person as the input. Every single facial feature must be preserved with pixel-level accuracy:",
  "- Exact same eye shape, eye color, eye spacing, and eye size",
  "- Exact same nose shape, nose width, and nose bridge",
  "- Exact same mouth shape and lip thickness",
  "- Exact same jawline, chin shape, and face width",
  "- Exact same forehead shape and size",
  "- Exact same skin tone, skin texture, moles, wrinkles, and marks",
  "- Exact same facial hair pattern - same beard shape, density, and color",
  "- Exact same eyebrow shape and thickness",
  "If the output face does not look like the same person, the result is a FAILURE.",
  "",
  "HAIR: Gently neaten the existing hairstyle. Only smooth out flyaways and minor messiness. Keep the exact same hair color, length, thickness, and general style. Do NOT change the hairstyle dramatically.",
  "",
  "CLOTHING: Add a dark navy formal suit jacket, white dress shirt with collar, and a dark tie below the neck. Only the shoulders and upper chest should be visible.",
  "",
  "BACKGROUND: Plain uniform light gray. No shadows.",
  "",
  "LIGHTING: Soft, even studio lighting. Correct any color cast from the original photo to show natural skin tones. No harsh shadows.",
  "",
  "FRAMING: Passport crop - head centered, face fills 70-80% of height, straight posture.",
  "",
  "EXPRESSION: Keep the natural expression. Mouth closed, eyes open, looking at camera.",
  "",
  "Output one photorealistic image. No artistic filters. Generate the image now.",
].join("\n");

// Max duration for serverless function (image generation takes time)
export const maxDuration = 120;

function extractImage(data: Record<string, unknown>): string | null {
  const dataArr = data.data as Array<{ url?: string; b64_json?: string }> | undefined;
  if (dataArr && dataArr[0]) {
    if (dataArr[0].b64_json) return "data:image/png;base64," + dataArr[0].b64_json;
    if (dataArr[0].url) return dataArr[0].url;
  }

  const choices = data.choices as Array<{ message?: { content?: unknown; images?: unknown[] } }> | undefined;
  const msg = choices && choices[0] && choices[0].message;
  if (!msg) return null;

  if (typeof msg.content === "string") {
    const c = msg.content;
    if (c.startsWith("data:image")) return c;

    const mdDataMatch = c.match(/!\[.*?\]\((data:image\/[^)]+)\)/);
    if (mdDataMatch) return mdDataMatch[1];

    const mdUrlMatch = c.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
    if (mdUrlMatch) return mdUrlMatch[1];

    const urlMatch = c.match(/(https?:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|webp)[^\s"'<>]*)/i);
    if (urlMatch) return urlMatch[1];

    if (c.length > 1000 && /^[A-Za-z0-9+/=\s]+$/.test(c.trim())) {
      return "data:image/png;base64," + c.trim().replace(/\s/g, "");
    }
  }

  if (Array.isArray(msg.content)) {
    for (const part of msg.content as Array<Record<string, unknown>>) {
      if (part.type === "image_url") {
        const iu = part.image_url as { url?: string } | undefined;
        if (iu && iu.url) return iu.url;
      }
      if (part.type === "image" && part.url) return part.url as string;
      if (part.type === "image" && part.b64_json) return "data:image/png;base64," + part.b64_json;
      if (part.inline_data) {
        const id = part.inline_data as { data: string; mime_type?: string };
        return "data:" + (id.mime_type || "image/png") + ";base64," + id.data;
      }
    }
  }

  if (Array.isArray(msg.images) && msg.images.length > 0) {
    const img = msg.images[0] as Record<string, unknown>;
    const iu = img.image_url as { url?: string } | undefined;
    if (iu && iu.url) return iu.url;
    if (img.url) return img.url as string;
    if (img.b64_json) return "data:image/png;base64," + img.b64_json;
  }

  return null;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GETGOAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GETGOAPI_KEY nicht gesetzt." }, { status: 500 });
  }

  try {
    const formDataIn = await req.formData();
    const file = formDataIn.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Kein Bild hochgeladen." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = "data:" + mimeType + ";base64," + base64;

    console.log("[v0] Image received:", Math.round(arrayBuffer.byteLength / 1024), "KB, type:", mimeType);

    // Try gpt-4o-image via /v1/images/edits (multipart) -- proven to work
    const editForm = new FormData();
    const blob = new Blob([arrayBuffer], { type: mimeType });
    editForm.append("image", blob, "photo.jpg");
    editForm.append("prompt", PROMPT);
    editForm.append("model", "gpt-4o-image");
    editForm.append("size", "1024x1024");

    const res = await fetch("https://api.getgoapi.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
      },
      body: editForm,
    });

    const rawText = await res.text();
    console.log("[v0] API response status:", res.status);
    console.log("[v0] API response body (first 800 chars):", rawText.slice(0, 800));

    if (!res.ok) {
      return NextResponse.json(
        { error: "API Fehler (" + res.status + ")", debug: rawText.slice(0, 400) },
        { status: res.status }
      );
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "Ungueltige API-Antwort", debug: rawText.slice(0, 400) },
        { status: 502 }
      );
    }

    const image = extractImage(data);

    if (image) {
      console.log("[v0] Image extracted successfully, length:", image.length);
      return NextResponse.json({ image });
    }

    console.log("[v0] No image found in response. Keys:", Object.keys(data));
    return NextResponse.json(
      {
        error: "Kein Bild in der Antwort gefunden. Bitte erneut versuchen.",
        debug: "Keys: " + Object.keys(data).join(", ") + ". First 200: " + rawText.slice(0, 200),
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("[v0] Error:", error);
    return NextResponse.json(
      { error: "Unerwarteter Fehler.", debug: String(error) },
      { status: 500 }
    );
  }
}
