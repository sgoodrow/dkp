import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { Scope } from "@/shared/constants/scopes";
import { createHash } from "crypto";

const getHashedApiKey = (apiKey: string) => {
  return createHash("sha256").update(apiKey).digest("hex");
};

export const apiKeyRepository = (p: PrismaTransactionClient = prisma) => ({
  count: async ({ userId }: { userId: string }) => {
    return p.apiKey.count({
      where: {
        userId,
      },
    });
  },

  get: async ({ apiKeyId }: { apiKeyId: number }) => {
    return p.apiKey.findUniqueOrThrow({
      where: {
        id: apiKeyId,
      },
    });
  },

  getAll: async ({ userId }: { userId: string }) => {
    return p.apiKey.findMany({
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
    return p.apiKey.create({
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
    return p.apiKey.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  },

  delete: async ({ apiKeyId }: { apiKeyId: number }) => {
    return p.apiKey.delete({
      where: {
        id: apiKeyId,
      },
    });
  },

  getApiKeyUser: async ({ apiKey }: { apiKey: string }) => {
    const hashedApiKey = getHashedApiKey(apiKey);
    const { user } = await p.apiKey.findUniqueOrThrow({
      where: {
        hashedApiKey,
      },
      include: {
        user: true,
      },
    });
    return user;
  },
});
