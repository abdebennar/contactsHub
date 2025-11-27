// "use client";

// import { ReactNode, useState } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// export default function ContactsLayout({ children }: { children: ReactNode }) {
// 	// Create QueryClient instance once using useState
// 	const [queryClient] = useState(() => new QueryClient({
// 		defaultOptions: {
// 			queries: {
// 				staleTime: 1000 * 60 * 5, // 5 minutes
// 				refetchOnWindowFocus: false,
// 			},
// 		},
// 	}));

// 	return (
// 		<QueryClientProvider client={queryClient}>
// 			{children}
// 		</QueryClientProvider>
// 	);
// }