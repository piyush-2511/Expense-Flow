import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagDefinitionService } from '../../supabase/tagDefinitionService'
import { useAppSelector } from '../../store/hooks'

// ================================================================
// tagQueries.ts
//
// TanStack Query hooks wrapping tagDefinitionService.
// Components import these — never the service directly.
// ================================================================

const QUERY_KEY = 'tag_definitions'

// ── Fetch all tag definitions for the current user ──
export function useTagDefinitions() {
  const userId = useAppSelector(state => state.auth.user?.id)

  return useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => tagDefinitionService.getTagDefinitions(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // tag list rarely changes, cache for 5 min
  })
}

// ── Add a new tag definition ──
export function useAddTagDefinition() {
  const queryClient = useQueryClient()
  const userId = useAppSelector(state => state.auth.user?.id)

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string | null }) =>
      tagDefinitionService.addTagDefinition({ userId: userId!, name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] })
    },
  })
}

// ── Delete a tag definition ──
export function useDeleteTagDefinition() {
  const queryClient = useQueryClient()
  const userId = useAppSelector(state => state.auth.user?.id)

  return useMutation({
    mutationFn: (id: string) => tagDefinitionService.deleteTagDefinition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] })
    },
  })
}

// ── Update a tag definition's name or color ──
export function useUpdateTagDefinition() {
  const queryClient = useQueryClient()
  const userId = useAppSelector(state => state.auth.user?.id)

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { name?: string; color?: string } }) =>
      tagDefinitionService.updateTagDefinition(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] })
    },
  })
}