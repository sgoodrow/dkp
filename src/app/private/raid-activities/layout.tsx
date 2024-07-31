import { RaidActivitiesRouteLayout } from "@/ui/raid-activities/RaidActivitiesRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <RaidActivitiesRouteLayout>{children}</RaidActivitiesRouteLayout>;
}
