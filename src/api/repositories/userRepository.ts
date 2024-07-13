import { prisma } from "@/api/repositories/prisma";

export const userRepository = {
  get: async ({ userId }: { userId: string }) => {
    return prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
  },

  getByEmail: async ({ email }: { email: string }) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};
