import { FiltersPopover, type FiltersState } from '../model/FiltersPopover'
import { SearchField } from '../model/SearchField'

interface SearchAndFiltersProps {
	search: string
	onSearchChange: (search: string) => void
	filters: FiltersState
	onFiltersChange: (filters: Partial<FiltersState>) => void
	onClear: () => void
}

export function SearchAndFilters({
	search,
	onSearchChange,
	filters,
	onFiltersChange,
	onClear
}: SearchAndFiltersProps) {
	return (
		<div className='my-8 flex items-center gap-x-4'>
			<SearchField value={search} onChange={onSearchChange} />
			<FiltersPopover
				filters={filters}
				onFiltersChange={onFiltersChange}
				onClear={onClear}
			/>
		</div>
	)
}
