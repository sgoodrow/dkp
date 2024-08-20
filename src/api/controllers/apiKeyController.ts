import { ENV } from "@/api/env";
import { apiKeyRepository } from "@/api/repositories/apiKeyRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { app } from "@/shared/constants/app";
import { SCOPE, Scope } from "@/shared/constants/scopes";
import { TRPCError } from "@trpc/server";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import * as uuid from "uuid";

const JWT_ALGORITHM = "HS256";
const JWT_SECRET = ENV.SECRET;
const AUTHORIZATION_HEADER_JWT_REGEXP = /^Bearer\s+(\S+\.\S+\.\S+)$/;

export const apiKeyController = (p?: PrismaTransactionClient) => ({
  count: async ({ userId }: { userId: string }) => {
    return apiKeyRepository(p).count({ userId });
  },

  get: async ({ apiKeyId }: { apiKeyId: number }) => {
    return apiKeyRepository(p).get({ apiKeyId });
  },

  getAll: async ({ userId }: { userId: string }) => {
    return apiKeyRepository(p).getAll({ userId });
  },

  create: async ({
    name,
    userId,
    scopes,
    expiresAt,
  }: {
    name: string;
    userId: string;
    scopes: Scope[];
    expiresAt: Date;
  }) => {
    const apiKey = sign(
      {
        sub: userId,
        iss: app.name,
        aud: app.name,
        scopes,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(expiresAt.getTime() / 1000),
        jti: uuid.v4(),
      },
      JWT_SECRET,
      {
        algorithm: JWT_ALGORITHM,
      },
    );
    await apiKeyRepository(p).create({
      name,
      userId,
      apiKey,
      expiresAt,
      scopes,
    });
    return apiKey;
  },

  deleteExpired: async () => {
    return apiKeyRepository(p).deleteExpired();
  },

  delete: async ({
    apiKeyId,
    userId,
  }: {
    apiKeyId: number;
    userId: string;
  }) => {
    const apiKey = await apiKeyController().get({
      apiKeyId,
    });
    if (apiKey.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can only delete your own API keys.",
      });
    }

    return apiKeyRepository(p).delete({ apiKeyId });
  },

  authorize: async ({
    authHeader,
    scope,
  }: {
    authHeader: string | null;
    scope: Scope;
  }) => {
    if (!authHeader) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Missing authorization header.",
      });
    }
    const match = authHeader?.match(AUTHORIZATION_HEADER_JWT_REGEXP);
    if (!match) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Malformed authorization header.",
      });
    }

    const apiKey = match?.[1];
    let decoded: string | JwtPayload;
    try {
      decoded = verify(apiKey, JWT_SECRET, {
        issuer: app.name,
        audience: app.name,
        algorithms: [JWT_ALGORITHM],
      });
    } catch (error) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Invalid API key",
      });
    }
    if (typeof decoded === "string") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Invalid API key.",
      });
    }
    if (!decoded.scopes?.includes(scope)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `API key does not have the required scope: ${SCOPE[scope]}.`,
      });
    }
    return apiKeyRepository(p).getApiKeyUser({ apiKey });
  },
});
