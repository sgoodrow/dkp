import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Discord from "next-auth/providers/discord";
import { prisma } from "@/api/repositories/shared/client";
import { walletController } from "@/api/controllers/walletController";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Discord],
  events: {
    createUser: async ({ user }) => {
      if (user.id === undefined) {
        throw new Error("Could not create wallet because user ID is undefined");
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
