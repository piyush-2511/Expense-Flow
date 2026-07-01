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








// ── Add these interfaces and functions to your existing dashboardService.ts ──

export interface MonthlyOverview {
  month_start: string
  total: number
  expense_count: number
}

export interface MonthlyDailyTotal {
  day: string
  total: number
}

export interface MonthlyTagTotal {
  tag_name: string
  total: number
}

export interface MonthlySummary {
  total_spent: number
  avg_daily_spend: number
  highest_expense: number
  highest_spend_day: string | null
  highest_day_total: number
  most_used_tag: string | null
  expense_count: number
}

// Returns every month that has expenses, newest first
// Powers the MonthsListPage
export const getMonthlyOverview = async (userId: string): Promise<MonthlyOverview[]> => {
  const { data, error } = await supabase.rpc('get_monthly_overview', {
    p_user_id: userId,
  })
  if (error) throw error
  return data as MonthlyOverview[]
}

// Returns one row per day in the month, including zero-spend days
// Powers the bar chart in MonthAnalysisDetail
export const getMonthlyDailyTotals = async (
  userId: string,
  monthStart: string
): Promise<MonthlyDailyTotal[]> => {
  const { data, error } = await supabase.rpc('get_monthly_daily_totals', {
    p_user_id: userId,
    p_month_start: monthStart,
  })
  if (error) throw error
  return data as MonthlyDailyTotal[]
}

// Returns each tag + total spend for that month only
// Powers the tag breakdown bar in MonthAnalysisDetail
export const getMonthlyTagTotals = async (
  userId: string,
  monthStart: string
): Promise<MonthlyTagTotal[]> => {
  const { data, error } = await supabase.rpc('get_monthly_tag_totals', {
    p_user_id: userId,
    p_month_start: monthStart,
  })
  if (error) throw error
  return data as MonthlyTagTotal[]
}

// Returns a single summary row for the month
// Powers the summary cards + highlight banner in MonthAnalysisDetail
export const getMonthlySummary = async (
  userId: string,
  monthStart: string
): Promise<MonthlySummary> => {
  const { data, error } = await supabase.rpc('get_monthly_summary', {
    p_user_id: userId,
    p_month_start: monthStart,
  })
  if (error) throw error
  return (data as MonthlySummary[])[0]
}