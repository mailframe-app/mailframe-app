import { FiltersPopover } from '../model/FiltersPopover'
import { SearchField } from '../model/SearchField'

export function SearchAndFilters({ tabId }: { tabId: string }) {
	return (
		<div className='mb-6 flex items-center gap-x-4'>
			<SearchField />
			<FiltersPopover tabId={tabId} />
		</div>
	)
}
