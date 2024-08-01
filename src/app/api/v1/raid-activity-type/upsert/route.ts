import {
  getTrpcHandler,
  NextTrpcOptions,
  TrpcRouteInputs,
} from "@/api/views/trpc/trpcRoutes";

const handler = ({
  trpc,
  body,
}: NextTrpcOptions<null, TrpcRouteInputs["raidActivity"]["upsertType"]>) => {
  return trpc.raidActivity.upsertType({
    name: body.name,
    defaultPayout: Number(body.defaultPayout),
  });
};

const trpcHandler = getTrpcHandler(handler);

export { trpcHandler as POST };
