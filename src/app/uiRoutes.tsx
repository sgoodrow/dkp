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
  ShoppingCart,
  SmartToy,
} from "@mui/icons-material";
import dayjs from "dayjs";

export const uiRoutes = {
  // Install pages
  install: {
    segment: "install",
    href: () => `/${uiRoutes.install.segment}` as const,
    name: "Install",
  },
  setup: {
    href: () => `${uiRoutes.install.href()}/setup` as const,
    name: "Setup",
  },
  migrate: {
    href: () => `${uiRoutes.install.href()}/migrate` as const,
    name: "Migrate",
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
    description: "View information most relevant to you.",
    icon: Home,
    dataMonitoringId: monitoringIds.GOTO_HOME,
  },
  players: {
    segment: "players",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.players.segment}` as const,
    name: "Players",
    description: "View all players.",
    icon: People,
    dataMonitoringId: monitoringIds.GOTO_PLAYERS,
  },
  player: {
    href: (id: string) => `${uiRoutes.players.href()}/${id}` as const,
    name: (name: string) => `Player - ${name}`,
    dataMonitoringId: monitoringIds.GOTO_PLAYER,
  },
  playerAttendance: {
    href: (id: string) => `${uiRoutes.player.href(id)}/attendance` as const,
    name: "Attendance",
    dataMonitoringId: monitoringIds.GOTO_PLAYER_ATTENDANCE,
  },
  playerPurchases: {
    href: (id: string) => `${uiRoutes.player.href(id)}/purchases` as const,
    name: "Purchases",
    dataMonitoringId: monitoringIds.GOTO_PLAYER_PURCHASES,
  },
  playerAdjustments: {
    href: (id: string) => `${uiRoutes.player.href(id)}/adjustments` as const,
    name: "Adjustments",
    dataMonitoringId: monitoringIds.GOTO_PLAYER_ADJUSTMENTS,
  },
  character: {
    href: ({ userId, characterId }: { userId: string; characterId: number }) =>
      `${uiRoutes.player.href(userId)}/character/${characterId}` as const,
    name: (name: string) => `Character - ${name}`,
    dataMonitoringId: monitoringIds.GOTO_CHARACTER,
  },
  raidActivities: {
    segment: "raid-activities",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.raidActivities.segment}` as const,
    name: "Raid Activities",
    description: "View all raid activity.",
    icon: Event,
    dataMonitoringId: monitoringIds.GOTO_RAID_ACTIVITIES,
    selectedIfIncludes: true,
  },
  raidActivity: {
    href: (raidId: number) =>
      `${uiRoutes.raidActivities.href()}/${raidId}` as const,
    name: ({ createdAt, type }: { createdAt: Date; type: { name: string } }) =>
      `${dayjs(createdAt).format("M/D")} ${type.name}`,
    dataMonitoringId: monitoringIds.GOTO_RAID_ACTIVITY_ATTENDANCE,
  },
  raidActivityAttendance: {
    segment: "attendance",
    href: (raidId: number) =>
      `${uiRoutes.raidActivity.href(raidId)}/${uiRoutes.raidActivityAttendance.segment}` as const,
    name: (options: { createdAt: Date; type: { name: string } }) =>
      `${uiRoutes.raidActivity.name(options)} - Attendance`,
    dataMonitoringId: monitoringIds.GOTO_RAID_ACTIVITY_ATTENDANCE,
  },
  raidActivityAdjustments: {
    segment: "adjustments",
    href: (raidId: number) =>
      `${uiRoutes.raidActivity.href(raidId)}/${uiRoutes.raidActivityAdjustments.segment}` as const,
    name: (options: { createdAt: Date; type: { name: string } }) =>
      `${uiRoutes.raidActivity.name(options)} - Attendance`,
    dataMonitoringId: monitoringIds.GOTO_RAID_ACTIVITY_ADJUSTMENTS,
  },
  raidActivityPurchases: {
    segment: "purchases",
    href: (raidId: number) =>
      `${uiRoutes.raidActivity.href(raidId)}/${uiRoutes.raidActivityPurchases.segment}` as const,
    name: (options: { createdAt: Date; type: { name: string } }) =>
      `${uiRoutes.raidActivity.name(options)} - Attendance`,
    dataMonitoringId: monitoringIds.GOTO_RAID_ACTIVITY_PURCHASES,
  },
  purchases: {
    segment: "purchases",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.purchases.segment}` as const,
    name: "Purchases",
    description: "View all purchases.",
    icon: ShoppingCart,
    dataMonitoringId: monitoringIds.GOTO_PURCHASES,
  },
  items: {
    segment: "items",
    href: () => `${uiRoutes.private.href()}/${uiRoutes.items.segment}` as const,
    name: "Items",
    description: "View all items.",
    icon: BusinessCenter,
    dataMonitoringId: monitoringIds.GOTO_ITEMS,
  },
  adjustments: {
    segment: "adjustments",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.adjustments.segment}` as const,
    name: "Adjustments",
    description: "View all ad-hoc adjustment bonuses.",
    icon: AutoFixHigh,
    dataMonitoringId: monitoringIds.GOTO_ADJUSTMENTS,
  },
  leaderboard: {
    segment: "leaderboard",
    href: () =>
      `${uiRoutes.private.href()}/${uiRoutes.leaderboard.segment}` as const,
    name: "Leaderboard",
    description:
      "View the players who currently have the most DKP for each class.",
    icon: EmojiEvents,
    dataMonitoringId: monitoringIds.GOTO_LEADERBOARD,
  },
  item: {
    href: ({ itemId }: { itemId: number }) =>
      `${uiRoutes.items.href()}/${itemId}` as const,
    name: (name: string) => `Item - ${name}`,
    dataMonitoringId: monitoringIds.GOTO_ITEM,
  },
  admin: {
    segment: "admin",
    href: () => `${uiRoutes.private.href()}/${uiRoutes.admin.segment}` as const,
    name: "Admin",
    description: "Review current administrators.",
    icon: AdminPanelSettings,
    dataMonitoringId: monitoringIds.GOTO_ADMIN,
    adminOnly: true,
  },
  raidActivityTypes: {
    href: () => `${uiRoutes.admin.href()}/raid-types` as const,
    name: "Raid Activity Types",
    description:
      "View and manage raid activity types to categorize raid activites.",
    dataMonitoringId: monitoringIds.GOTO_RAID_TYPES,
    icon: EventRepeat,
    adminOnly: true,
  },
  transactions: {
    href: () => `${uiRoutes.admin.href()}/transactions` as const,
    name: "Transactions",
    description: "Amend uncleared transactions to apply them to a player.",
    dataMonitoringId: monitoringIds.GOTO_TRANSACTIONS,
    icon: AssignmentInd,
    adminOnly: true,
  },
  apiKeys: {
    href: () => `${uiRoutes.admin.href()}/api-keys` as const,
    name: "API Keys",
    description:
      "View and manage API keys which are used to access the API programmatically.",
    dataMonitoringId: monitoringIds.GOTO_API_KEYS,
    icon: Key,
    adminOnly: true,
  },
  bots: {
    href: () => `${uiRoutes.admin.href()}/bots` as const,
    name: "Bots",
    description:
      "View and manage bots, characters which have no default pilot.",
    dataMonitoringId: monitoringIds.GOTO_BOTS,
    icon: SmartToy,
    adminOnly: true,
  },
} as const;
