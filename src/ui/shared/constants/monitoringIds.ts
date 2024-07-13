import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

// These names are used for custom events and should not be changed.
export const eventNames = keysAreSameAsValuesCheck({});

export type EventName = keyof typeof eventNames;

// These IDs are used for monitoring purposes and should not be changed.
export const monitoringIds = keysAreSameAsValuesCheck({
  // Internal app navigation
  GOTO_HOME: "GOTO_HOME",

  GOTO_API_KEYS: "GOTO_API_KEYS",

  GOTO_SETTINGS: "GOTO_SETTINGS",

  GOTO_LOGOUT: "GOTO_LOGOUT",

  // External app navigation

  // Copy actions
  COPY_CURRENT_LINK_TO_CLIPBOARD: "COPY_CURRENT_LINK_TO_CLIPBOARD",

  COPY_API_KEY: "COPY_API_KEY",

  // Toggle actions
  TOGGLE_SETTINGS_OPEN: "TOGGLE_SETTINGS_OPEN",

  TOGGLE_LIGHT_MODE_THEME: "TOGGLE_LIGHT_MODE_THEME",

  TOGGLE_SYSTEM_MODE_THEME: "TOGGLE_SYSTEM_MODE_THEME",

  TOGGLE_DARK_MODE_THEME: "TOGGLE_DARK_MODE_THEME",

  // Authentication
  SIGN_IN_DISCORD: "SIGN_IN_DISCORD",

  SIGN_OUT: "SIGN_OUT",
});

export type MonitoringId = keyof typeof monitoringIds;
