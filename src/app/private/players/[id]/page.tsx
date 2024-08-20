import { PlayerRoutePage } from "@/ui/player/PlayerRoutePage";
import { FC } from "react";

const Page: FC<{ params: { id: string } }> = ({ params }) => {
  return <PlayerRoutePage id={params.id} />;
};

export default Page;
