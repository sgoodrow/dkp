import type { NextRequest } from "next/server";
import { ENV } from "@/api/env";
import { userController } from "@/api/controllers/userController";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${ENV.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await userController().syncDiscordMetadata();

  return Response.json({ success: true });
}
