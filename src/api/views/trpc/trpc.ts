import { TrpcRoutes } from "@/api/views/trpc/trpcRoutes";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<TrpcRoutes>({});
