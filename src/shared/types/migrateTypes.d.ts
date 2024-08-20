export type MigrateSummary = {
  users: {
    id: string;
    walletId: number;
    eqdkpId: number;
  }[];
  characters: MigrateCharacter[];
  raidActivityTypes: {
    id: number;
    eqdkpId: number;
  }[];
  raidActivities: {
    id: number;
    eqdkpId?: number;
  }[];
};

export type MigrateCharacter = MigrateCharacterInvalid | MigrateCharacterValid;

export type MigrateCharacterInvalid = MigrateCharacterCommon & {
  valid: false;
  missingOwner: boolean;
  invalidName: boolean;
  invalidRaceClassCombination: boolean;
  duplicateNormalizedName: boolean;
};

export type MigrateCharacterValid = MigrateCharacterCommon & {
  valid: true;
  id: number;
  classId: number;
  raceId: number;
  defaultPilotId: string | null;
  walletId: number | null;
};

type MigrateCharacterCommon = {
  name: string;
  eqdkpId: number;
};
