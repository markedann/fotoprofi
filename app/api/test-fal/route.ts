import { NextResponse } from "next/server";

export async function GET() {
  const rawKey = process.env.FAL_KEY;
  if (!rawKey) {
    return NextResponse.json({ error: "FAL_KEY not set" });
  }

  const falKey = rawKey.trim().replace(/^[.\s]+/, "").replace(/[.\s]+$/, "");

  const debug = {
    keyLength: falKey.length,
    firstChars: falKey.slice(0, 12),
    lastChars: falKey.slice(-6),
    containsColon: falKey.includes(":"),
    containsSpaces: falKey !== falKey.replace(/\s/g, ""),
    headerValue: `Key ${falKey.slice(0, 12)}...`,
  };

  // Test against a simple fal.ai endpoint
  try {
    const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "test",
        image_size: "square",
        num_images: 1,
      }),
    });

    return NextResponse.json({
      debug,
      testStatus: res.status,
      testStatusText: res.statusText,
      testBody: await res.text().then((t) => t.slice(0, 500)),
    });
  } catch (err: unknown) {
    return NextResponse.json({
      debug,
      fetchError: err instanceof Error ? err.message : String(err),
    });
  }
}
