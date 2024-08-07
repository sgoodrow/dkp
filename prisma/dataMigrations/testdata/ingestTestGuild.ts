import { guildController } from "@/api/controllers/guildController";
import { DEVENV } from "prisma/dataMigrations/testdata/devenv";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting dev guild");

export const ingestTestGuild = async ({ userId }: { userId: string }) => {
  logger.info("Started workflow.");

  await guildController().create({
    name: DEVENV.DEV_GUILD_NAME,
    discordServerId: DEVENV.DEV_GUILD_DISCORD_SERVER_ID,
    discordAdminRoleId: DEVENV.DEV_GUILD_DISCORD_ADMIN_ROLE_ID,
    discordInviteLink: DEVENV.DEV_GUILD_DISCORD_INVITE_LINK,
    rulesLink: DEVENV.DEV_GUILD_RULES_LINK,
    createdById: userId,
    updatedById: userId,
  });

  logger.info("Finished workflow.");
};
