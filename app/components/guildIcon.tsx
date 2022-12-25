import type { FC } from "react";
import { config } from "~/config";
import { CustomIcon } from "./customIcon";

export const GuildIcon: FC<{ bgcolor?: string }> = ({ bgcolor = "white" }) => (
  <CustomIcon src={config.guildIcon} alt="Guild Icon" bgcolor={bgcolor} />
);
