import { PrivateRouteLayout } from "@/ui/navigation/PrivateRouteLayout";

export default async function Layout({ children }: React.PropsWithChildren) {
  return <PrivateRouteLayout>{children}</PrivateRouteLayout>;
}
