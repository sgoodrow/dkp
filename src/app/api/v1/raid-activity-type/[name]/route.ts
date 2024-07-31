import {
  getTrpcHandler,
  NextTrpcOptions,
  TrpcRouteInputs,
} from "@/api/views/trpc/trpcRoutes";

const handler = ({
  trpc,
  params,
}: NextTrpcOptions<TrpcRouteInputs["raidActivity"]["getTypeByName"], null>) => {
  return trpc.raidActivity.getTypeByName({
    name: params.name,
  });
};

const trpcHandler = getTrpcHandler(handler);

export { trpcHandler as GET };
