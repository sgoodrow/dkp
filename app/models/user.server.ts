import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export const getUserById = async (id: User["id"]) =>
  prisma.user.findUnique({ where: { id } });

export const getUserByDiscordId = async (discordId: User["discordId"]) =>
  prisma.user.findUnique({ where: { discordId } });

export const createUser = async (discordId: User["discordId"]) =>
  prisma.user.create({
    data: {
      discordId,
    },
  });

export const deleteUserByDiscordId = async (discordId: User["discordId"]) =>
  prisma.user.delete({ where: { discordId } });

export const verifyLogin = async (discordId: User["discordId"]) =>
  prisma.user.findUnique({
    where: { discordId },
  });
