import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { NextRequest, NextResponse } from "next/server";
import superjson from "superjson";
import { apiKeyApiRoutes } from "@/api/views/apiRoutes/apiKeyApiRoutes";
import { healthApiRoutes } from "@/api/views/apiRoutes/healthApiRoutes";
import { userApiRoutes } from "@/api/views/apiRoutes/userApiRoutes";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  createCallerFactory,
  createRoutes,
} from "@/api/views/trpc/trpcBuilder";
import { characterApiRoutes } from "@/api/views/apiRoutes/characterApiRoutes";
import { raidActivityApiRoutes } from "@/api/views/apiRoutes/raidActivityApiRoutes";
import { walletApiRoutes } from "@/api/views/apiRoutes/walletApiRoutes";
import { discordApiRoutes } from "@/api/views/apiRoutes/discordApiRoutes";
import { itemApiRoutes } from "@/api/views/apiRoutes/itemApiRoutes";

export const trpcRoutes = createRoutes({
  health: healthApiRoutes,
  user: userApiRoutes,
  apiKey: apiKeyApiRoutes,
  character: characterApiRoutes,
  raidActivity: raidActivityApiRoutes,
  wallet: walletApiRoutes,
  discord: discordApiRoutes,
  item: itemApiRoutes,
});

export const createSSRHelper = () =>
  createServerSideHelpers({
    router: trpcRoutes,
    transformer: superjson,
    ctx: {
      authHeader: null,
    },
  });

export type TrpcRoutes = typeof trpcRoutes;

export type TrpcRouteInputs = inferRouterInputs<TrpcRoutes>;

export type TrpcRouteOutputs = inferRouterOutputs<TrpcRoutes>;

const createCaller = createCallerFactory(trpcRoutes);

export type NextTrpcOptions<RouteParams = any, Body = any> = {
  trpc: ReturnType<typeof createCaller>;
  body: Body;
  routeParams: RouteParams;
  queryParams: URLSearchParams;
};

export const getTrpcHandler = (
  handler: (options: NextTrpcOptions) => Promise<any>,
) => {
  return async (
    request: NextRequest,
    options: {
      params: unknown;
    },
  ) => {
    const authHeader = request.headers.get("Authorization");

    try {
      const result = await handler({
        trpc: createCaller({ authHeader }),
        body: await request.json(),
        routeParams: options.params,
        queryParams: new URL(request.url).searchParams,
      });
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof TRPCError) {
        return NextResponse.json(
          { error: error.message },
          { status: getHTTPStatusCodeFromError(error) },
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
};
