import { ENV } from "@/api/env";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

export type PrismaTransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

// This avoids the development server hotmodule reloading leading to
// multiple connections being instantiated.
if (ENV.NODE_ENV !== "production") {
  global.prisma = prisma;
}
