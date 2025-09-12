import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { useDebounce } from '@consta/uikit/useDebounce'
import { useEffect, useMemo, useState } from 'react'

import { modals } from '@/shared/lib'

import { type FiltersState } from '../model/FiltersPopover'
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from '../model/constants'

import { SearchAndFilters } from './SearchAndFilters'
import {
	NamedTemplateCard,
	NamedTemplateCardSkeleton,
	type TemplateListItem,
	useTemplatesList
} from '@/entities/templates'

interface SelectTemplateModalProps {
	campaignId: string
	onSuccess: (template: TemplateListItem) => void
}

export function SelectTemplateModal({ onSuccess }: SelectTemplateModalProps) {
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState(search)
	const [filters, setFilters] = useState<FiltersState>({
		sortBy: DEFAULT_SORT_BY,
		sortOrder: DEFAULT_SORT_ORDER,
		tags: []
	})

	const debouncedSetSearch = useDebounce(setDebouncedSearch, 300)

	useEffect(() => {
		debouncedSetSearch(search)
	}, [search, debouncedSetSearch])

	const { data, isLoading } = useTemplatesList({
		search: debouncedSearch,
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder,
		tags: filters.tags
	})

	const allTemplates = useMemo(() => {
		const favorites = data?.favoriteTemplates || []
		const regular = data?.templates || []
		return [...favorites, ...regular]
	}, [data])

	const handleFiltersChange = (newFilters: Partial<FiltersState>) => {
		setFilters(prev => ({ ...prev, ...newFilters }))
	}

	const handleClear = () => {
		setSearch('')
		setFilters({
			sortBy: DEFAULT_SORT_BY,
			sortOrder: DEFAULT_SORT_ORDER,
			tags: []
		})
	}

	const handleSelect = (template: TemplateListItem) => {
		onSuccess(template)
		modals.closeTop()
	}

	const hasContent = allTemplates.length > 0

	return (
		<Layout className='p-4' direction='column'>
			<SearchAndFilters
				search={search}
				onSearchChange={setSearch}
				filters={filters}
				onFiltersChange={handleFiltersChange}
				onClear={handleClear}
			/>

			{isLoading && (
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
					{Array.from({ length: 8 }).map((_, index) => (
						<NamedTemplateCardSkeleton key={index} />
					))}
				</div>
			)}

			{!isLoading && !hasContent && (
				<div className='mt-8'>
					<ResponsesEmptyPockets
						size='m'
						actions={<Button label='Очистить фильтры' onClick={handleClear} />}
						title='Ничего не найдено'
						description='Попробуйте изменить параметры поиска или очистить фильтры'
					/>
				</div>
			)}

			{!isLoading && hasContent && (
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
					{allTemplates.map(template => (
						<NamedTemplateCard
							key={template.id}
							template={template}
							onClick={handleSelect}
						/>
					))}
				</div>
			)}
		</Layout>
	)
}
