import {
  getTrpcHandler,
  NextTrpcOptions,
  TrpcRouteInputs,
} from "@/api/views/trpc/trpcRoutes";

const handler = ({
  trpc,
}: NextTrpcOptions<{}, TrpcRouteInputs["raidActivity"]["getAllTypes"]>) => {
  return trpc.raidActivity.getAllTypes();
};

const trpcHandler = getTrpcHandler(handler);

export { trpcHandler as GET };
