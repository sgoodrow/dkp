import type { NextRequest } from "next/server";
import { apiKeyController } from "@/api/controllers/apiKeyController";
import { ENV } from "@/api/env";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${ENV.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await apiKeyController.deleteExpired();

  return Response.json({ success: true });
}
