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

export const trpcRoutes = createRoutes({
  health: healthApiRoutes,
  user: userApiRoutes,
  apiKey: apiKeyApiRoutes,
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

export type NextTrpcOptions<Params = any> = {
  trpc: ReturnType<typeof createCaller>;
  body: any;
  params: Params;
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
        params: options.params,
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
