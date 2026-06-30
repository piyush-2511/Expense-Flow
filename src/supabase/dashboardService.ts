import { supabase } from './client'

// ================================================================
// dashboardService.ts
//
// Calls the two RPC functions defined in schema.sql:
//   get_tag_totals(p_user_id)   → for the pie chart
//   get_daily_totals(p_user_id) → for the calendar heatmap
// ================================================================

export interface TagTotal {
  tag_name: string
  total: number
}

export interface DailyTotal {
  date: string
  total: number
}

export const dashboardService = {

  getTagTotals: async (userId: string): Promise<TagTotal[]> => {
    const { data, error } = await supabase.rpc('get_tag_totals', {
      p_user_id: userId,
    })
    if (error) throw error
    return data as TagTotal[]
  },

  getDailyTotals: async (userId: string): Promise<DailyTotal[]> => {
    const { data, error } = await supabase.rpc('get_daily_totals', {
      p_user_id: userId,
    })
    if (error) throw error
    return data as DailyTotal[]
  },

}