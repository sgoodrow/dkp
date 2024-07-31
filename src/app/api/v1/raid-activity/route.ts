import {
  getTrpcHandler,
  NextTrpcOptions,
  TrpcRouteInputs,
} from "@/api/views/trpc/trpcRoutes";

const handler = ({
  trpc,
  body,
}: NextTrpcOptions<null, TrpcRouteInputs["raidActivity"]["create"]>) => {
  return trpc.raidActivity.create(body);
};

const trpcHandler = getTrpcHandler(handler);

export { trpcHandler as POST };
