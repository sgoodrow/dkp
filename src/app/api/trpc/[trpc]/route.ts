import { trpcRoutes } from "@/api/views/trpc/trpcRoutes";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: trpcRoutes,
    createContext: ({ req }) => {
      return {
        authHeader: req.headers.get("Authorization"),
      };
    },
  });
};

export { handler as GET, handler as POST };
