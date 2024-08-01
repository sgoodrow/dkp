import type { NextRequest } from "next/server";
import { ENV } from "@/api/env";
import { discordController } from "@/api/controllers/discordController";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${ENV.CRON_SECRET}`) {
    return new Response(
      "Unauthorized, this endpoint is only accessible via cron job",
      { status: 403 },
    );
  }

  await discordController().sync({ userId: null });

  return Response.json({ success: true });
}
