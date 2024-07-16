import { AdjustmentsRouteLayout } from "@/ui/adjustments/AdjustmentsRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <AdjustmentsRouteLayout>{children}</AdjustmentsRouteLayout>;
}
