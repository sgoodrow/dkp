import { prisma } from "@/api/repositories/prisma";
import { Scope } from "@/shared/constants/scopes";
import { createHash } from "crypto";

const getHashedApiKey = (apiKey: string) => {
  return createHash("sha256").update(apiKey).digest("hex");
};

export const apiKeyRepository = {
  count: async ({ userId }: { userId: string }) => {
    return prisma.apiKey.count({
      where: {
        userId,
      },
    });
  },

  get: async ({ apiKeyId }: { apiKeyId: number }) => {
    return prisma.apiKey.findUniqueOrThrow({
      where: {
        id: apiKeyId,
      },
    });
  },

  getAll: async ({ userId }: { userId: string }) => {
    return prisma.apiKey.findMany({
      where: {
        userId,
      },
    });
  },

  create: async ({
    name,
    userId,
    apiKey,
    expiresAt,
    scopes,
  }: {
    name: string;
    userId: string;
    apiKey: string;
    expiresAt: Date;
    scopes: Scope[];
  }) => {
    return prisma.apiKey.create({
      data: {
        name,
        userId,
        hashedApiKey: getHashedApiKey(apiKey),
        expires: expiresAt,
        scopes,
      },
    });
  },

  deleteExpired: async () => {
    return prisma.apiKey.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  },

  delete: async ({ apiKeyId }: { apiKeyId: number }) => {
    return prisma.apiKey.delete({
      where: {
        id: apiKeyId,
      },
    });
  },

  getApiKeyUser: async ({ apiKey }: { apiKey: string }) => {
    const hashedApiKey = getHashedApiKey(apiKey);
    return prisma.apiKey
      .findUniqueOrThrow({
        where: {
          hashedApiKey,
        },
        include: {
          user: true,
        },
      })
      .then(({ user }) => user);
  },
};
