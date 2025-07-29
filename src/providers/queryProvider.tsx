// components/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactNode, useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 24 hours
            gcTime: 1000 * 30, // 24 hours
          },
        },
      })
  );

  useEffect(() => {
    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
    });

    persistQueryClient({
      queryClient: client,
      persister,
    });
  }, [client]);

  return (
    <QueryClientProvider client={client}>
      {children} <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
