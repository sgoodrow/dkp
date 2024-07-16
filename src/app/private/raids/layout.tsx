import { RaidsRouteLayout } from "@/ui/raids/RaidsRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <RaidsRouteLayout>{children}</RaidsRouteLayout>;
}
