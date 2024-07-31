import { apiKeyController } from "@/api/controllers/apiKeyController";
import { userController } from "@/api/controllers/userController";
import { agGridSchema } from "@/api/shared/agGridUtils/table";
import { auth } from "@/auth";
import { Scope } from "@/shared/constants/scopes";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createLogger, format, transports } from "winston";
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

const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    logger.error({
      message: "Request failed",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    throw error;
  }
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

    // Ensure that all APIs being consumed programmatically have a meta scope
    if (!meta?.scope) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Protected procedures ${path} has no meta scope. Only procedures with meta scopes are available programmatically.`,
      });
    }

    // Check if the user is using an API key with the appropriate scope
    if (meta.scope) {
      const { id } = await apiKeyController().authorize({
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

export const agFetchProcedure = protectedProcedure.input(agGridSchema);

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const isAdmin = await userController().isAdmin({
    userId: ctx.userId,
  });

  if (!isAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this resource.",
    });
  }

  return next();
});

export const protectedApiKeyProcedure = adminProcedure
  .input(
    z.object({
      apiKeyId: z.number().positive().int(),
    }),
  )
  .use(async ({ input, ctx, next }) => {
    const apiKey = await apiKeyController().get({
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
