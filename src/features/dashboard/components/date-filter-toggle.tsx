import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { DateRangeFilter } from '@/types/api'

const OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: 'Today', label: 'Today' },
  { value: 'Last7Days', label: 'Last 7 days' },
  { value: 'Last30Days', label: 'Last 30 days' },
  { value: 'AllTime', label: 'All time' },
]

interface DateFilterToggleProps {
  value: DateRangeFilter
  onChange: (value: DateRangeFilter) => void
}

export function DateFilterToggle({ value, onChange }: DateFilterToggleProps) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => next[0] && onChange(next[0] as DateRangeFilter)}
      variant="outline"
      className="flex-wrap justify-start"
      aria-label="Filter by date range"
    >
      {OPTIONS.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value} className="px-3 text-sm">
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
