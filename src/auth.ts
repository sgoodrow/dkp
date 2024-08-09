import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Discord from "next-auth/providers/discord";
import { prisma } from "@/api/repositories/shared/prisma";
import { walletController } from "@/api/controllers/walletController";
import { discordController } from "@/api/controllers/discordController";
import { ENV } from "@/api/env";
import { installController } from "@/api/controllers/installController";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: ENV.SECRET,
  providers: [
    Discord({
      allowDangerousEmailAccountLinking: true,
      clientId: ENV.DISCORD_AUTH_CLIENT_ID,
      clientSecret: ENV.DISCORD_AUTH_CLIENT_SECRET,
    }),
  ],
  events: {
    signIn: async ({ user }) => {
      if (user.id === undefined) {
        throw new Error("User ID is undefined during signIn event.");
      }
      const isInstalled = await installController().isInstalled();
      if (!isInstalled) {
        return;
      }
      await discordController().upsertUserMetadata({
        userId: user.id,
      });
    },
    createUser: async ({ user }) => {
      if (user.id === undefined) {
        throw new Error("User ID is undefined during createUser event.");
      }
      await walletController().upsert({
        userId: user.id,
      });
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
