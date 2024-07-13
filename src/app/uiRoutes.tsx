import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Home, Key, Settings } from "@mui/icons-material";

export const uiRoutes = {
  login: {
    href: () => "/login" as const,
    name: "Login",
  },
  private: {
    href: () => "/private" as const,
    home: {
      href: () => `${uiRoutes.private.href()}/home` as const,
      name: "Home",
      icon: Home,
      dataMonitoringId: monitoringIds.GOTO_HOME,
    },
    settings: {
      href: () => `${uiRoutes.private.href()}/settings` as const,
      name: "Settings",
      icon: Settings,
      dataMonitoringId: monitoringIds.GOTO_SETTINGS,
      apiKeys: {
        href: () => `${uiRoutes.private.settings.href()}/keys` as const,
        name: "API Keys",
        icon: Key,
        dataMonitoringId: monitoringIds.GOTO_API_KEYS,
      },
    },
  },
} as const;
