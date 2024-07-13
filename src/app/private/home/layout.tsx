import { HomeRouteLayout } from "@/ui/home/HomeRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <HomeRouteLayout>{children}</HomeRouteLayout>;
}
