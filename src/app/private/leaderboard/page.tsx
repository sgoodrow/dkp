import { LeaderboardRoutePage } from "@/ui/leaderboard/LeaderboardRoutePage";
import { uiRoutes } from "@/app/uiRoutes";
import { Metadata, ResolvingMetadata } from "next";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.leaderboard.name, parent);
};

export default function Page() {
  return <LeaderboardRoutePage />;
}
