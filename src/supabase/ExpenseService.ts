import { supabase } from './client'

// ================================================================
// expenseService.ts
//
// Pure async functions for expense CRUD operations.
// No Redux, no React — just functions that take inputs and
// return promises. expenseQueries.ts wraps these in TanStack Query.
// ================================================================

export interface Expense {
  id: string
  user_id: string
  amount: number
  description: string
  date: string       // ISO date string, e.g. "2026-06-30"
  created_at: string
  tags: string[]      // comes from the expenses_with_tags view
}

export interface AddExpenseParams {
  userId: string
  amount: number
  description: string
  date: string
  tags: string[]
}

export interface UpdateExpenseParams {
  id: string
  amount: number
  description: string
  date: string
  tags: string[]
  userId: string
}

export const expenseService = {

  // ── Get all expenses for a user, with tags attached ──
  // Uses the expenses_with_tags view (defined in schema.sql)
  getExpenses: async (userId: string): Promise<Expense[]> => {
    const { data, error } = await supabase
      .from('expenses_with_tags')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error
    return data as Expense[]
  },

  // ── Get expenses filtered by tag name ──
  // Used by the search bar on My Daily Expenses page
  searchByTag: async (userId: string, tagName: string): Promise<Expense[]> => {
    const { data, error } = await supabase
      .from('expenses_with_tags')
      .select('*')
      .eq('user_id', userId)
      .contains('tags', [tagName])
      .order('date', { ascending: false })

    if (error) throw error
    return data as Expense[]
  },

  // ── Add a new expense, then attach its tags ──
  // Two-step: insert expense row, then insert tag rows linked to it
  addExpense: async ({ userId, amount, description, date, tags }: AddExpenseParams) => {
    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .insert({ user_id: userId, amount, description, date })
      .select()
      .single()

    if (expenseError) throw expenseError

    if (tags.length > 0) {
      const tagRows = tags.map(name => ({
        expense_id: expense.id,
        user_id: userId,
        name: name.trim(),
      }))

      const { error: tagError } = await supabase.from('tags').insert(tagRows)
      if (tagError) throw tagError
    }

    return expense
  },

  // ── Update an expense's fields + replace its tags entirely ──
  // Simplest approach: delete all old tags, insert new ones
  updateExpense: async ({ id, amount, description, date, tags, userId }: UpdateExpenseParams) => {
    const { error: updateError } = await supabase
      .from('expenses')
      .update({ amount, description, date })
      .eq('id', id)

    if (updateError) throw updateError

    // Replace tags: delete old, insert new
    const { error: deleteError } = await supabase
      .from('tags')
      .delete()
      .eq('expense_id', id)

    if (deleteError) throw deleteError

    if (tags.length > 0) {
      const tagRows = tags.map(name => ({
        expense_id: id,
        user_id: userId,
        name: name.trim(),
      }))

      const { error: tagError } = await supabase.from('tags').insert(tagRows)
      if (tagError) throw tagError
    }
  },

  // ── Delete an expense ──
  // Tags auto-delete via ON DELETE CASCADE in schema.sql
  deleteExpense: async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) throw error
  },

}