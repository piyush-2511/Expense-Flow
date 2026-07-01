import { useTagDefinitions } from './tagQueries'
import type { TagDefinition } from '../../supabase/tagDefinitionService'

// ================================================================
// TagPicker.tsx
//
// Reusable multi-select tag picker.
// Used inside ExpenseDialog instead of the old free-text tag input.
// Reads from tag_definitions so users pick pre-created tags only.
// ================================================================

interface TagPickerProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export default function TagPicker({ selectedTags, onChange }: TagPickerProps) {
  const { data: tagDefinitions = [], isLoading } = useTagDefinitions()

  const toggleTag = (name: string) => {
    if (selectedTags.includes(name)) {
      onChange(selectedTags.filter(t => t !== name))
    } else {
      onChange([...selectedTags, name])
    }
  }

  if (isLoading) {
    return <p className="text-xs text-gray-400 dark:text-gray-500 py-1">Loading tags…</p>
  }

  if (tagDefinitions.length === 0) {
    return (
      <p className="text-xs text-gray-400 dark:text-gray-500 py-1">
        No tags yet —{' '}
        <a
          href="/tags"
          className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 underline"
        >
          create your tags first
        </a>
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tagDefinitions.map((tag: TagDefinition) => {
        const isSelected = selectedTags.includes(tag.name)
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.name)}
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
              transition-all active:scale-[0.96] border
              ${isSelected
                ? 'text-white border-transparent shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
            style={isSelected ? { backgroundColor: tag.color ?? '#3b82f6' } : {}}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(255,255,255,0.6)'
                  : (tag.color ?? '#9ca3af'),
              }}
            />
            {tag.name}
          </button>
        )
      })}
    </div>
  )
}