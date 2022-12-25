import { CustomIcon } from "./customIcon";

const discordBlurple = "#5865F2";

export const DiscordIcon = (): JSX.Element => (
  <CustomIcon
    src="/graphics/discord-icon.svg"
    alt="Discord"
    bgcolor={discordBlurple}
  />
);
