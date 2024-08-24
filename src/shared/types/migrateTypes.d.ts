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
  name: string;
  remoteId: number;
  missingOwner: boolean;
  invalidName: boolean;
  duplicateNormalizedName: boolean;
};

export type MigrateCharacterValid = MigrateCharacterCommon & {
  valid: true;
  name: string;
  remoteId: number;
  classId: number;
  raceId: number;
  defaultPilotId: string | null;
};

type MigrateCharacterCommon = {
  name: string;
  remoteId: number;
};
