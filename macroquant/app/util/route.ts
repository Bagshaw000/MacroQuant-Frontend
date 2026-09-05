import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const apiUrl = "https://domianmt5.xyz/v1/cot";

    console.log("Proxying request to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Next.js-Proxy/1.0",
      },
      signal: AbortSignal.timeout(40000),
    });

    if (!response.ok) {
      console.error(
        "API responded with error:",
        response.status,
        response.statusText,
      );
      return NextResponse.json(
        { error: `API returned ${response.status}: ${response.statusText}` },
        { status: response.status },
      );
    }
    const data = await response.json();
   

    // Return with proper CORS headers for your client
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);

    // Handle timeout specifically
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Request timeout - server took too long to respond" },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch data",
      },
      { status: 500 },
    );
  }
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
