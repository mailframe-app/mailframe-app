import { FiltersPopover } from '../model/FiltersPopover'
import { SearchField } from '../model/SearchField'

interface SearchAndFiltersProps {
	tabId: string
}

export function SearchAndFilters({}: SearchAndFiltersProps) {
	return (
		<div className='mb-6 flex items-center gap-x-4'>
			<SearchField />
			{/* {tabId === 'my-templates' && <FiltersPopover />}
			 */}
			<FiltersPopover />
		</div>
	)
}
