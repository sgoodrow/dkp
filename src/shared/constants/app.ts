import { guild } from "@/shared/constants/guild";

export const app = {
  maintainerName: "Pumped",
  maintainerDiscordUserId: "266714829010632705",
  sourceCodeHost: "GitHub",
  sourceCodeUrl: "https://github.com/sgoodrow/dkp",
  name: "eq-dkp-app",
  title: `${guild.name} DKP`,
  titleIcon: "💎",
  description: "An app for managing DKP.",
  copy: {
    noneAssociated: "None associated.",
    notRecognized: "Not recognized",
  },
} as const;
