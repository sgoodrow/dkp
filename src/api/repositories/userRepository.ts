import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import { guild } from "@/shared/constants/guild";

export const userRepository = (p: PrismaTransactionClient = prisma) => ({
  getAdmins: async () => {
    return p.user.findMany({
      where: {
        discordMetadata: {
          roleIds: {
            hasSome: [guild.discordAdminRoleId],
          },
        },
      },
      include: {
        discordMetadata: true,
      },
    });
  },

  getProviderUserId: async ({
    userId,
    provider,
  }: {
    userId: string;
    provider: string;
  }) => {
    const user = await p.user.findUniqueOrThrow({
      where: {
        id: userId,
        AND: {
          accounts: {
            some: {
              provider,
            },
          },
        },
      },
      include: {
        accounts: true,
      },
    });
    const providerAccountId = user.accounts?.[0].providerAccountId;
    if (!providerAccountId) {
      throw new Error("No provider account found");
    }
    return providerAccountId;
  },

  getManyByProviderAccountIds: async ({
    providerAccountIds,
    provider,
  }: {
    providerAccountIds: string[];
    provider: string;
  }) => {
    return p.user.findMany({
      where: {
        accounts: {
          some: {
            provider,
            providerAccountId: {
              in: providerAccountIds,
            },
          },
        },
      },
      select: {
        id: true,
        accounts: {
          select: {
            providerAccountId: true,
          },
        },
      },
    });
  },

  get: async ({ userId }: { userId: string }) => {
    return p.user.findUniqueOrThrow({
      where: { id: userId },
    });
  },

  getByEmail: async ({ email }: { email: string }) => {
    return p.user.findUnique({
      where: { email },
    });
  },

  getAllDiscordMetadata: async () => {
    return p.userDiscordMetadata.findMany({
      select: {
        memberId: true,
      },
    });
  },

  searchByName: async ({ search, take }: { search: string; take: number }) => {
    return p.user.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take,
    });
  },

  deleteDiscordMetadataByMemberIds: async ({
    memberIds,
  }: {
    memberIds: string[];
  }) => {
    return p.userDiscordMetadata.deleteMany({
      where: {
        memberId: {
          in: memberIds,
        },
      },
    });
  },

  upsertDiscordMetadata: async ({
    metadata,
  }: {
    metadata: {
      userId: string | null;
      memberId: string;
      displayName: string;
      roleIds: string[];
    }[];
  }) => {
    return prisma.$transaction(async (p) => {
      await userRepository(p).deleteDiscordMetadataByMemberIds({
        memberIds: metadata.map((r) => r.memberId),
      });
      await p.userDiscordMetadata.createMany({
        data: metadata,
      });
    });
  },
});
