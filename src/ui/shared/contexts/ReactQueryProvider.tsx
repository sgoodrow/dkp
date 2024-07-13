"use client";

import { MINUTES } from "@/shared/constants/time";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef } from "react";

export const ReactQueryProvider: FCWithChildren = ({ children }) => {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          // Since client components are initially rendered server-side,
          // we usually want to set some default staleTime above 0 to
          // avoid refetching immediately on the client.
          staleTime: 1 * MINUTES,
          throwOnError: true,
        },
      },
    }),
  );
  return (
    <QueryClientProvider client={queryClient.current}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
