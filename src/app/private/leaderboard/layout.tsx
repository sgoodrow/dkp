import { LeaderboardRouteLayout } from "@/ui/leaderboard/LeaderboardRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <LeaderboardRouteLayout>{children}</LeaderboardRouteLayout>;
}
