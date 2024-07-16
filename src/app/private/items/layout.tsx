import { ItemsRouteLayout } from "@/ui/items/ItemsRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <ItemsRouteLayout>{children}</ItemsRouteLayout>;
}
