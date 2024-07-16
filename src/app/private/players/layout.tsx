import { PlayersRouteLayout } from "@/ui/players/PlayersRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <PlayersRouteLayout>{children}</PlayersRouteLayout>;
}
