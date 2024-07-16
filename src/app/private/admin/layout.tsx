import { AdminRouteLayout } from "@/ui/admin/AdminRouteLayout";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <AdminRouteLayout>{children}</AdminRouteLayout>;
}
