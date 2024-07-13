import { apiKeyController } from "@/api/controllers/apiKeyController";
import { auth } from "@/auth";
import { Scope } from "@/shared/constants/scopes";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

const t = initTRPC
  .context<{
    authHeader: string | null;
  }>()
  .meta<{
    scope: Scope;
  }>()
  .create({
    transformer: superjson,
  });

export const createRoutes = t.router;

export const publicProcedure = t.procedure;

export const createCallerFactory = t.createCallerFactory;

export const protectedProcedure = t.procedure.use(
  async ({ meta, ctx, next, path }) => {
    // Check if the user is logged in.
    const session = await auth();
    if (session?.user?.id) {
      return next({
        ctx: {
          ...ctx,
          userId: session.user.id,
        },
      });
    }

    if (!meta) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Missing meta for protected procedure: ${path}.`,
      });
    }

    // Check if the user is using an API key with the appropriate scope
    if (meta?.scope) {
      const { id } = await apiKeyController.authorize({
        authHeader: ctx.authHeader,
        scope: meta.scope,
      });

      return next({
        ctx: {
          ...ctx,
          userId: id,
        },
      });
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: meta?.scope
        ? "You must be logged in or using an API key to access this resource."
        : "You must be logged in to access this resource.",
    });
  },
);

export const protectedApiKeyProcedure = protectedProcedure
  .input(
    z.object({
      apiKeyId: z.number().positive().int(),
    }),
  )
  .use(async ({ input, ctx, next }) => {
    const apiKey = await apiKeyController.get({
      apiKeyId: input.apiKeyId,
    });
    if (apiKey.userId !== ctx.userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have access to this API key.",
      });
    }

    return next();
  });
