import React from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { TransactionsRouteLayout } from "@/ui/transactions/TransactionsRouteLayout";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.transactions.name, parent);
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <TransactionsRouteLayout>{children}</TransactionsRouteLayout>;
}
