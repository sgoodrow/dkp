import { guildController } from "@/api/controllers/guildController";
import { PrivateRouteLayout } from "@/ui/navigation/PrivateRouteLayout";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const name = await guildController().getName();
  if (name === null) {
    const { title } = await parent;
    return { title };
  }
  return generateMetadataTitle(name, parent);
};

export default async function Layout({ children }: React.PropsWithChildren) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  return (
    <PrivateRouteLayout isMobile={isMobile}>{children}</PrivateRouteLayout>
  );
}
