import { apiKeyController } from "@/api/controllers/apiKeyController";
import { installController } from "@/api/controllers/installController";
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

export const installProcedure = t.procedure
  .input(
    z.object({
      activationKey: z.string(),
    }),
  )
  .use(async ({ next, input }) => {
    const isValid = await installController().isValidActivationKey({
      activationKey: input.activationKey,
    });

    if (!isValid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid activation key",
      });
    }

    const userId = await userController().getSystemUserId();

    return next({
      ctx: {
        userId,
      },
    });
  });

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

    // Check if the user is authorized to use this procedure programmatically.
    if (meta?.scope) {
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
      code: "FORBIDDEN",
      message: `Procedure ${path} has no meta scope. Only procedures with meta scopes are available programmatically.`,
    });
  },
);

export const agFetchProcedure = protectedProcedure.input(agGridSchema);

export const ownerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const isOwner = await userController().isOwner({
    userId: ctx.userId,
  });

  if (!isOwner) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this resource.",
    });
  }

  return next();
});

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
