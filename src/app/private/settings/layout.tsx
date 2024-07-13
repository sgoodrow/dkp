import { SettingsRouteLayout } from "@/ui/settings/SettingsRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <SettingsRouteLayout>{children}</SettingsRouteLayout>;
}
