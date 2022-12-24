import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import type { User } from "~/models/user.server";
import { createUser, getUserByDiscordId } from "~/models/user.server";
import { DiscordStrategy } from "remix-auth-socials";

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "_session",
});

authenticator.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/callback`,
    },
    async ({ profile }) => {
      let user = await getUserByDiscordId(profile.id);
      if (user) {
        return user;
      }

      user = await createUser(profile.id);
      if (!user) {
        throw "TODO: failed to create user";
      }
      return user;
    }
  )
);
