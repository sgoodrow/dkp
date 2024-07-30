import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/api/env";

const getCorsHeaders = (origin: string) => {
  const isAllowedOrigin = origin === ENV.DISCORD_SERVER_ORIGIN;
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
};

export const middleware = (request: NextRequest) => {
  const origin = request.headers.get("origin") ?? "";

  // Handle preflighted requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  }

  // Handle requests
  const response = NextResponse.next();
  Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

export const config = {
  matcher: "/api/:path*",
};
