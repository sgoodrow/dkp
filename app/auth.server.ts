import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import type { User } from "~/models/user.server";
import { createUser, getUserByDiscordId } from "~/models/user.server";
import { DiscordStrategy } from "remix-auth-socials";
import { paths } from "./paths";
import { secrets } from "./secrets.server";

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "_session",
});

authenticator.use(
  new DiscordStrategy(
    {
      clientID: secrets.discordClientId,
      clientSecret: secrets.discordClientSecret,
      callbackURL: `${secrets.baseUrl}${paths.loginCallback()}`,
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
