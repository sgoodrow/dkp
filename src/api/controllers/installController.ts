import { ENV } from "@/api/env";
import {
  CreateInstallAttempt,
  installRepository,
} from "@/api/repositories/installRepository";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { z } from "zod";
import { characterController } from "@/api/controllers/characterController";
import { processAllInBatches } from "prisma/dataMigrations/util/batch";
import { itemController } from "@/api/controllers/itemController";
import { guildController } from "@/api/controllers/guildController";
import { discordController } from "@/api/controllers/discordController";
import { TRPCError } from "@trpc/server";

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

const installRaceClassCombinations = async (p: PrismaTransactionClient) => {
  const { default: data } = await import("prisma/data/eq/classes.json");
  const classCombinations = z
    .array(
      z.object({
        name: z.string(),
        allowedRaces: z.array(z.string()),
      }),
    )
    .parse(data);

  await characterController(p).createRaceClassCombinations({
    classCombinations,
  });
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

  await processAllInBatches({
    items,
    process: (batch) => itemController(p).createMany({ items: batch }),
    batchSize: 5000,
  });
};

export const installController = (p?: PrismaTransactionClient) => ({
  getStatus: async () => {
    const latest = await installController().getLatest();
    return latest?.status || null;
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
    if (
      latest?.status === "COMPLETE" ||
      latest?.status === "READY_FOR_IMPORT"
    ) {
      throw new TRPCError({ code: "CONFLICT", message: "Already installed" });
    }

    // Start install
    const data: Partial<CreateInstallAttempt> = {};

    await prisma.$transaction(async (p) => {
      try {
        await installRaces(p);
        data.installedRaces = true;

        await installClasses(p);
        data.installedClasses = true;

        await installRaceClassCombinations(p);
        data.installedRaceClassCombinations = true;

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

        await installRepository().create({
          ...data,
          createdById: userId,
          status: "READY_FOR_IMPORT",
        });
      } catch (err) {
        await installRepository().create({
          ...data,
          createdById: userId,
          status: "FAIL",
          error: String(err),
        });
        throw err;
      }
    });

    return data;
  },

  complete: async ({ userId }: { userId: string }) => {
    const latest = await installController(p).getLatest();
    if (latest?.status !== "READY_FOR_IMPORT") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Installation cannot be completed yet",
      });
    }
    await discordController(p).sync({ userId });
    return installRepository(p).complete({ id: latest.id });
  },
});
