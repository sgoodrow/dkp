import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

// These names are used for custom events and should not be changed.
export const eventNames = keysAreSameAsValuesCheck({});

export type EventName = keyof typeof eventNames;

// These IDs are used for monitoring purposes and should not be changed.
export const monitoringIds = keysAreSameAsValuesCheck({
  // Internal app navigation
  GOTO_HOME: "GOTO_HOME",

  GOTO_PLAYERS: "GOTO_PLAYERS",

  GOTO_PLAYER: "GOTO_PLAYER",

  GOTO_CHARACTER: "GOTO_CHARACTER",

  GOTO_RAIDS: "GOTO_RAIDS",

  GOTO_RAID: "GOTO_RAID",

  GOTO_ITEMS: "GOTO_ITEMS",

  GOTO_ITEM: "GOTO_ITEM",

  GO_BACK: "GO_BACK",

  GOTO_ADJUSTMENTS: "GOTO_ADJUSTMENTS",

  GOTO_LEADERBOARD: "GOTO_LEADERBOARD",

  GOTO_ADMIN: "GOTO_ADMIN",

  GOTO_RAID_TYPES: "GOTO_RAID_TYPES",

  GOTO_PERMISSIONS: "GOTO_PERMISSIONS",

  GOTO_UNASSIGNED_CHARACTERS: "GOTO_UNASSIGNED_CHARACTERS",

  GOTO_API_KEYS: "GOTO_API_KEYS",

  // External app navigation
  GOTO_DISCORD: "GOTO_DISCORD",

  GOTO_DISCORD_MAINTAINER: "GOTO_DISCORD_MAINTAINER",

  GOTO_DISCORD_SUPPORT: "GOTO_DISCORD_SUPPORT",

  GOTO_SOURCE_CODE: "GOTO_SOURCE_CODE",

  GOTO_RULES: "GOTO_RULES",

  // Copy actions
  COPY_CURRENT_LINK_TO_CLIPBOARD: "COPY_CURRENT_LINK_TO_CLIPBOARD",

  COPY_API_KEY: "COPY_API_KEY",

  // Toggle actions
  TOGGLE_THEME_CHANGE_OPEN: "TOGGLE_THEME_CHANGE_OPEN",

  TOGGLE_LIGHT_MODE_THEME: "TOGGLE_LIGHT_MODE_THEME",

  TOGGLE_SYSTEM_MODE_THEME: "TOGGLE_SYSTEM_MODE_THEME",

  TOGGLE_DARK_MODE_THEME: "TOGGLE_DARK_MODE_THEME",

  TOGGLE_HELP_OPEN: "TOGGLE_HELP_OPEN",

  // Authentication
  SIGN_IN_DISCORD: "SIGN_IN_DISCORD",

  SIGN_OUT: "SIGN_OUT",
});

export type MonitoringId = keyof typeof monitoringIds;
