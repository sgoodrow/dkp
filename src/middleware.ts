import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/api/env";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ENV.CORS_ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export const middleware = (request: NextRequest) => {
  // Handle preflighted requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // Handle requests
  const response = NextResponse.next();
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

export const config = {
  matcher: "/api/:path*",
};
