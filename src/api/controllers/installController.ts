import { ENV } from "@/api/env";
import { installRepository } from "@/api/repositories/installRepository";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { InstallAttemptStatus } from "@prisma/client";
import { z } from "zod";
import { characterController } from "@/api/controllers/characterController";
import { processBatch } from "prisma/dataMigrations/util/batch";
import { itemController } from "@/api/controllers/itemController";
import { guildController } from "@/api/controllers/guildController";
import { discordController } from "@/api/controllers/discordController";
import { MINUTES } from "@/shared/constants/time";
import { TRPCError } from "@trpc/server";

export const INSTALL_TIMEOUT = 1 * MINUTES;

const installRaces = async (p: PrismaTransactionClient) => {
  const { default: data } = await import("prisma/data/eq/races.json");
  const races = z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .parse(data);
  await characterController(p).createRaces({ races });
};

const installClasses = async (p: PrismaTransactionClient) => {
  const { default: data } = await import("prisma/data/eq/classes.json");
  const classes = z
    .array(
      z.object({
        name: z.string(),
        colorHexLight: z.string(),
        colorHexDark: z.string(),
      }),
    )
    .parse(data);

  await characterController(p).createClasses({ classes });
};

const installRaceClassCombos = async (p: PrismaTransactionClient) => {
  const { default: data } = await import("prisma/data/eq/classes.json");
  const classCombos = z
    .array(
      z.object({
        name: z.string(),
        allowedRaces: z.array(z.string()),
      }),
    )
    .parse(data);

  await characterController(p).createRaceClassCombos({ classCombos });
};

const installGameItems = async (p: PrismaTransactionClient) => {
  const { default: data } = await import("prisma/data/eq/items.json");
  const items = z
    .array(
      z.object({
        name: z.string(),
        wikiSlug: z.string(),
      }),
    )
    .parse(data);

  await processBatch(items, (batch) =>
    itemController(p).createMany({ items: batch }),
  );
};

export const installController = (p?: PrismaTransactionClient) => ({
  isInstalled: async () => {
    const attempt = await installRepository(p).getLatest();
    return attempt?.status === InstallAttemptStatus.SUCCESS;
  },

  get: async ({ id }: { id: number }) => {
    return installRepository(p).get({ id });
  },

  getLatest: async () => {
    return installRepository(p).getLatest();
  },

  isValidActivationKey: async ({
    activationKey,
  }: {
    activationKey: string;
  }) => {
    return activationKey === ENV.ACTIVATION_KEY;
  },

  start: async ({
    activationKey,
    name,
    discordServerId,
    discordOwnerRoleId,
    discordHelperRoleId,
    rulesLink,
    userId,
  }: {
    activationKey: string;
    name: string;
    discordServerId: string;
    discordOwnerRoleId: string;
    discordHelperRoleId: string;
    rulesLink: string;
    userId: string;
  }) => {
    // Validate activation key
    if (activationKey !== ENV.ACTIVATION_KEY) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid activation key",
      });
    }

    // Check if already installed or in progress
    const latest = await installController().getLatest();
    if (latest?.status === InstallAttemptStatus.SUCCESS) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Already installed",
      });
    }
    if (latest?.status === InstallAttemptStatus.IN_PROGRESS) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Already installed",
      });
    }

    // Start install
    const data = await installRepository().create({
      status: InstallAttemptStatus.IN_PROGRESS,
      createdById: userId,
    });

    await prisma.$transaction(async (p) => {
      try {
        await installRaces(p);
        data.installedRaces = true;

        await installClasses(p);
        data.installedClasses = true;

        await installRaceClassCombos(p);
        data.installedRaceClassCombos = true;

        await installGameItems(p);
        data.installedItems = true;

        await guildController(p).create({
          name,
          discordServerId,
          discordOwnerRoleId,
          discordHelperRoleId,
          rulesLink,
          createdById: userId,
          updatedById: userId,
        });
        data.installedGuild = true;

        await discordController(p).sync({ userId });
        data.syncedDiscordMetadata = true;

        data.status = "SUCCESS";
        await installRepository().update(data);
      } catch (err) {
        data.status = "FAIL";
        data.error = String(err);
        await installRepository().update(data);
        throw err;
      }
    });

    return data;
  },
});
