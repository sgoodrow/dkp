import {
  getTrpcHandler,
  NextTrpcOptions,
  TrpcRouteInputs,
} from "@/api/views/trpc/trpcRoutes";

const handler = ({
  trpc,
  body,
}: NextTrpcOptions<{}, TrpcRouteInputs["raidActivity"]["create"]>) => {
  return trpc.raidActivity.create(body);
};

const trpcHandler = getTrpcHandler(handler);

export { trpcHandler as POST };
