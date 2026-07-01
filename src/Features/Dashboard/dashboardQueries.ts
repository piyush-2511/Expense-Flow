import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../supabase/dashboardService'
import { useAuth } from '../../Hooks/useAuth'


export function useTagTotals() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['tagTotals', user?.id],
    queryFn: () => dashboardService.getTagTotals(user!.id),
    enabled: Boolean(user?.id),
  })
}

export function useDailyTotals() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['dailyTotals', user?.id],
    queryFn: () => dashboardService.getDailyTotals(user!.id),
    enabled: Boolean(user?.id),
  })
}










// ── Add these hooks to your existing dashboardQueries.ts ──
// Also add this import at the top if not already present:
import { useAppSelector } from '../../store/hooks'

import {
  getMonthlyOverview,
  getMonthlyDailyTotals,
  getMonthlyTagTotals,
  getMonthlySummary,
} from '../../supabase/dashboardService'

// List of all months that have at least one expense
export function useMonthlyOverview() {
  const userId = useAppSelector(state => state.auth.user?.id)

  return useQuery({
    queryKey: ['monthly_overview', userId],
    queryFn: () => getMonthlyOverview(userId!),
    enabled: !!userId,
  })
}

// One row per calendar day in the selected month (zeros included)
export function useMonthlyDailyTotals(monthStart: string) {
  const userId = useAppSelector(state => state.auth.user?.id)

  return useQuery({
    queryKey: ['monthly_daily_totals', userId, monthStart],
    queryFn: () => getMonthlyDailyTotals(userId!, monthStart),
    enabled: !!userId && !!monthStart,
  })
}

// Tag breakdown for the selected month
export function useMonthlyTagTotals(monthStart: string) {
  const userId = useAppSelector(state => state.auth.user?.id)

  return useQuery({
    queryKey: ['monthly_tag_totals', userId, monthStart],
    queryFn: () => getMonthlyTagTotals(userId!, monthStart),
    enabled: !!userId && !!monthStart,
  })
}

// Summary stats row for the selected month
export function useMonthlySummary(monthStart: string) {
  const userId = useAppSelector(state => state.auth.user?.id)

  return useQuery({
    queryKey: ['monthly_summary', userId, monthStart],
    queryFn: () => getMonthlySummary(userId!, monthStart),
    enabled: !!userId && !!monthStart,
  })
}