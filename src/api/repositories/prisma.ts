import { ENV } from "@/api/env";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

// This avoids the development server hotmodule reloading leading to
// multuple connections being instantiated.
if (ENV.NODE_ENV !== "production") {
  global.prisma = prisma;
}
