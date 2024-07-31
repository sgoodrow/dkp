import { getTrpcHandler, NextTrpcOptions } from "@/api/views/trpc/trpcRoutes";

const handler = ({ trpc }: NextTrpcOptions<null, null>) => {
  return trpc.raidActivity.getAllTypes();
};

const trpcHandler = getTrpcHandler(handler);

export { trpcHandler as GET };
