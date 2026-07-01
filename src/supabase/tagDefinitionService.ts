import { supabase } from './client'

// ================================================================
// tagDefinitionService.ts
//
// CRUD for the tag_definitions table — the master list of tags
// a user creates once and reuses when adding expenses.
// Follows the same pattern as expenseService.ts — no Redux, no React.
// ================================================================

export interface TagDefinition {
  id: string
  user_id: string
  name: string
  color: string | null
  created_at: string
}

export interface AddTagDefinitionParams {
  userId: string
  name: string
  color: string | null
}

export const tagDefinitionService = {

  // ── Fetch all tag definitions for a user, sorted A→Z ──
  getTagDefinitions: async (userId: string): Promise<TagDefinition[]> => {
    const { data, error } = await supabase
      .from('tag_definitions')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw error
    return data as TagDefinition[]
  },

  // ── Add a new tag definition ──
  // UNIQUE(user_id, name) constraint in DB prevents duplicates
  addTagDefinition: async ({ userId, name, color }: AddTagDefinitionParams): Promise<TagDefinition> => {
    const { data, error } = await supabase
      .from('tag_definitions')
      .insert({ user_id: userId, name: name.trim(), color })
      .select()
      .single()

    if (error) throw error
    return data as TagDefinition
  },

  // ── Delete a tag definition by id ──
  // Does NOT delete past expense tags — those rows in the `tags`
  // table are independent and stay intact for historical accuracy
  deleteTagDefinition: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tag_definitions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // ── Update tag name or color ──
  updateTagDefinition: async (
    id: string,
    updates: { name?: string; color?: string }
  ): Promise<void> => {
    const { error } = await supabase
      .from('tag_definitions')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  },
}