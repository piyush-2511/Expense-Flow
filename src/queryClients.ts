import { QueryClient } from '@tanstack/react-query'

// Single QueryClient instance — same pattern as the Supabase client
// Import this in main.tsx to wrap the app with QueryClientProvider
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,   // data considered fresh for 30s
      retry: 1,
    },
  },
})