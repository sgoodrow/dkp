import { prisma } from "@/api/repositories/shared/prisma";
import { ENV } from "@/api/env";
import {
  InstallProgress,
  installRepository,
} from "@/api/repositories/installRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { InstallAttemptStatus } from "@prisma/client";
import { z } from "zod";
import { characterController } from "@/api/controllers/characterController";
import { processBatch } from "prisma/dataMigrations/util/batch";
import { itemController } from "@/api/controllers/itemController";
import { guildController } from "@/api/controllers/guildController";
import { discordController } from "@/api/controllers/discordController";

type StepData = { id: number; createdById: string } & InstallProgress;
type Step = (p: PrismaTransactionClient) => Promise<void>;

const installStep = async ({
  p,
  data,
  step,
}: {
  p: PrismaTransactionClient;
  data: StepData;
  step: Step;
} & InstallProgress) => {
  try {
    await step(p);
  } catch (err) {
    await installRepository().update({
      ...data,
      status: InstallAttemptStatus.FAIL,
      error: String(err),
    });
    throw err;
  }
  await installRepository().update({
    ...data,
    status: InstallAttemptStatus.IN_PROGRESS,
  });
};

const installGameRaces = async (p: PrismaTransactionClient) => {
  const { default: data } = await import("prisma/data/eq/races.json");
  const races = z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .parse(data);
  for (const r of races) {
    await characterController(p).createRace(r);
  }
};

const installGameClasses = async (p: PrismaTransactionClient) => {
  const { default: data } = await import("prisma/data/eq/classes.json");
  const classes = z
    .array(
      z.object({
        name: z.string(),
        colorHexLight: z.string(),
        colorHexDark: z.string(),
        allowedRaces: z.array(z.string()),
      }),
    )
    .parse(data);

  for (const c of classes) {
    await characterController(p).createClass(c);
  }
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

  getLatest: async () => {
    return installRepository(p).getLatest();
  },

  // todo: add an installStatus api that gets progress on install?

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
    discordAdminRoleId,
    rulesLink,
    createdById,
    updatedById,
  }: {
    activationKey: string;
    name: string;
    discordServerId: string;
    discordOwnerRoleId: string;
    discordAdminRoleId: string;
    rulesLink: string;
    createdById: string;
    updatedById: string;
  }) => {
    // Check if we are already running or already installed
    const latest = await installRepository(p).getLatest();
    if (latest?.status === InstallAttemptStatus.SUCCESS) {
      throw new Error("Already installed.");
    }
    if (latest?.status === InstallAttemptStatus.IN_PROGRESS) {
      throw new Error("Already installing.");
    }

    // Check activation key
    if (activationKey !== ENV.ACTIVATION_KEY) {
      throw new Error("Invalid activation key.");
    }

    const { id } = await installRepository().create({
      status: InstallAttemptStatus.IN_PROGRESS,
      createdById,
    });

    return prisma.$transaction(async (p) => {
      const data: StepData = { id, createdById };

      await installStep({ p, data, step: installGameRaces });
      data.installedRaces = true;

      await installStep({ p, data, step: installGameClasses });
      data.installedClasses = true;

      await installStep({ p, data, step: installGameItems });
      data.installedItems = true;

      await installStep({
        p,
        data,
        step: async (p) => {
          await guildController(p).create({
            name,
            discordServerId,
            discordOwnerRoleId,
            discordAdminRoleId,
            rulesLink,
            createdById,
            updatedById: updatedById,
          });
        },
      });
      data.installedGuild = true;

      // (optional) apply eq dkp plus migration

      await installStep({
        p,
        data,
        step: async (p) => {
          await discordController(p).sync({ userId: createdById });
        },
      });
      data.syncedDiscordMetadata = true;

      await installRepository().update({
        ...data,
        status: InstallAttemptStatus.SUCCESS,
      });
    });
  },
});
