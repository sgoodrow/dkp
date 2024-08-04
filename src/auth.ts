import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Discord from "next-auth/providers/discord";
import { prisma } from "@/api/repositories/shared/prisma";
import { walletController } from "@/api/controllers/walletController";
import { discordController } from "@/api/controllers/discordController";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  events: {
    signIn: async ({ user }) => {
      if (user.id === undefined) {
        throw new Error("User ID is undefined during signIn event.");
      }
      await discordController().upsertUserMetadata({
        userId: user.id,
      });
    },
    createUser: async ({ user }) => {
      if (user.id === undefined) {
        throw new Error("User ID is undefined during createUser event.");
      }
      await walletController().create({
        userId: user.id,
      });
    },
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
