import { Character, CharacterClass, CharacterRace } from "@prisma/client";

export type CharacterRow = Character & {
  class: CharacterClass;
  race: CharacterRace;
};

type Inferred = {
  class: { name: string; colorHexDark: string; colorHexLight: string };
  race: { name: string };
} & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  defaultPilotId: string | null;
  classId: number;
  raceId: number;
};
