// contacts/layout.tsx
"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ContactsLayout({ children }: { children: ReactNode }) {
  // Create QueryClient instance once using useState
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// ====================================
// contacts/[id]/page.tsx (NO CHANGES NEEDED)
// Just remove any QueryClient creation if you accidentally added it
// ====================================
// Your page should NOT create QueryClient - it inherits from layout
// Just use useQuery, useMutation, useQueryClient as normal