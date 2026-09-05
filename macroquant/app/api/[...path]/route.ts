import { NextRequest, NextResponse } from "next/server";

// Server-side proxy for the upstream macro API. The browser calls same-origin
// `/api/<path>` and this handler forwards to `<API_BASE_URL>/<path>`, which
// sidesteps CORS (the upstream sends no Access-Control-Allow-Origin) and keeps
// the upstream host / any future credentials off the client.
const API_BASE_URL = process.env.API_BASE_URL ?? "https://domianmt5.xyz/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = `${API_BASE_URL}/${path.join("/")}${request.nextUrl.search}`;

  try {
    const upstream = await fetch(target, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(40000),
    });

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API proxy error:", target, error);
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "Upstream request timed out"
          : "Failed to reach upstream API",
      },
      { status: timedOut ? 504 : 502 },
    );
  }
}
