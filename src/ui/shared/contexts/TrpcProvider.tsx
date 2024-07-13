"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, getFetch, loggerLink } from "@trpc/client";
import { useRef, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { trpc } from "@/api/views/trpc/trpc";
import superjson from "superjson";

export const TrpcProvider: FCWithChildren = ({ children }) => {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: { queries: { staleTime: 5 * 1000 } },
    }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient.current}>
      <QueryClientProvider client={queryClient.current}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
