import type { NextRequest } from "next/server";
import { ENV } from "@/api/env";
import { discordController } from "@/api/controllers/discordController";
import { apiKeyController } from "@/api/controllers/apiKeyController";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${ENV.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const user = await apiKeyController().authorize({
    authHeader,
    scope: "sync_discord_metadata",
  });

  await discordController().sync({ userId: user.id });

  return Response.json({ success: true });
}
