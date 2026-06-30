import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expenseService } from '../../supabase/ExpenseService'
import type { AddExpenseParams, UpdateExpenseParams } from '../../supabase/ExpenseService'
import { useAuth } from '../../Hooks/useAuth'

// ================================================================
// expenseQueries.ts
//
// TanStack Query hooks — wraps expenseService directly.
// This is the "server state" layer: caching, refetching, loading
// states are all handled automatically by React Query.
//
// Components call these hooks, never expenseService directly.
// ================================================================

const EXPENSES_KEY = 'expenses'

// ── Fetch all expenses for the logged-in user ──
export function useExpenses() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [EXPENSES_KEY, user?.id],
    queryFn: () => expenseService.getExpenses(user!.id),
    enabled: Boolean(user?.id), // don't run until we have a user
  })
}

// ── Search expenses by tag name ──
export function useExpensesByTag(tagName: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: [EXPENSES_KEY, user?.id, 'tag', tagName],
    queryFn: () => expenseService.searchByTag(user!.id, tagName),
    enabled: Boolean(user?.id) && tagName.trim().length > 0,
  })
}

// ── Add a new expense ──
export function useAddExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: AddExpenseParams) => expenseService.addExpense(params),
    onSuccess: () => {
      // Refetch the expenses list after a successful add
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] })
    },
  })
}

// ── Update an existing expense ──
export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateExpenseParams) => expenseService.updateExpense(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] })
    },
  })
}

// ── Delete an expense ──
export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] })
    },
  })
}