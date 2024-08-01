import { RaidActivityRoutePage } from "@/ui/raid-activity/RaidActivityRoutePage";
import { FC } from "react";

const Page: FC<{ params: { id: string } }> = ({ params }) => {
  return <RaidActivityRoutePage id={Number(params.id)} />;
};

export default Page;
