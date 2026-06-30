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