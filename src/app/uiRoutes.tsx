import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import {
  AdminPanelSettings,
  AssignmentInd,
  AutoFixHigh,
  BusinessCenter,
  EmojiEvents,
  Event,
  EventRepeat,
  Home,
  Key,
  People,
} from "@mui/icons-material";

export const uiRoutes = {
  // Organizational segments
  root: {
    href: () => "/" as const,
  },
  private: {
    href: () => "/private" as const,
  },
  // Public pages
  login: {
    href: () => "/login" as const,
    name: "Login",
  },
  // Private pages aka sidebar routes
  home: {
    segment: "home",
    href: () => `${uiRoutes.private.href()}/${uiRoutes.home.segment}` as const,
    name: "Home",
    icon: Home,
    dataMonitoringId: monitoringIds.GOTO_HOME,
  },
  players: {
    segment: "players",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.players.segment}` as const,
    name: "Players",
    icon: People,
    dataMonitoringId: monitoringIds.GOTO_PLAYERS,
  },
  raids: {
    segment: "raids",
    href: () => `${uiRoutes.private.href()}/${uiRoutes.raids.segment}` as const,
    name: "Raids",
    icon: Event,
    dataMonitoringId: monitoringIds.GOTO_RAIDS,
  },
  items: {
    segment: "items",
    href: () => `${uiRoutes.private.href()}/${uiRoutes.items.segment}` as const,
    name: "Items",
    icon: BusinessCenter,
    dataMonitoringId: monitoringIds.GOTO_ITEMS,
  },
  adjustments: {
    segment: "adjustments",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.adjustments.segment}` as const,
    name: "Adjustments",
    icon: AutoFixHigh,
    dataMonitoringId: monitoringIds.GOTO_ADJUSTMENTS,
  },
  leaderboard: {
    segment: "leaderboard",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.leaderboard.segment}` as const,
    name: "Leaderboard",
    icon: EmojiEvents,
    dataMonitoringId: monitoringIds.GOTO_LEADERBOARD,
  },
  admin: {
    segment: "admin",
    href: () => `${uiRoutes.private.href()}/${uiRoutes.admin.segment}` as const,
    name: "Admin",
    icon: AdminPanelSettings,
    dataMonitoringId: monitoringIds.GOTO_ADMIN,
  },
  // Sub-pages
  player: {
    href: ({ playerId }: { playerId: string }) =>
      `${uiRoutes.players.href()}/${playerId}` as const,
    name: (name: string) => `Player - ${name}`,
    dataMonitoringId: monitoringIds.GOTO_PLAYER,
  },
  character: {
    href: ({
      playerId,
      characterId,
    }: {
      playerId: string;
      characterId: number;
    }) =>
      `${uiRoutes.player.href({ playerId })}/character/${characterId}` as const,
    name: (name: string) => `Character - ${name}`,
    dataMonitoringId: monitoringIds.GOTO_CHARACTER,
  },
  raid: {
    href: (raidId: number) => `${uiRoutes.raids.href()}/${raidId}` as const,
    name: (name: string) => `Raid - ${name}`,
    dataMonitoringId: monitoringIds.GOTO_RAID,
  },
  item: {
    href: (itemId: number) => `${uiRoutes.items.href()}/${itemId}` as const,
    name: (name: string) => `Item - ${name}`,
    dataMonitoringId: monitoringIds.GOTO_ITEM,
  },
  // Admin only sub-pages
  raidTypes: {
    href: () => `${uiRoutes.admin.href()}/raid-types` as const,
    name: "Raid Types",
    dataMonitoringId: monitoringIds.GOTO_RAID_TYPES,
    icon: EventRepeat,
  },
  unassignedCharacters: {
    href: () => `${uiRoutes.admin.href()}/unassigned-characters` as const,
    name: "Unassigned Characters",
    dataMonitoringId: monitoringIds.GOTO_UNASSIGNED_CHARACTERS,
    icon: AssignmentInd,
  },
  apiKeys: {
    href: () => `${uiRoutes.admin.href()}/api-keys` as const,
    name: "API Keys",
    dataMonitoringId: monitoringIds.GOTO_API_KEYS,
    icon: Key,
  },
} as const;
