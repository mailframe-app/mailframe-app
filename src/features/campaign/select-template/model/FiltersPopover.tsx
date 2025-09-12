import { IconFunnel } from '@consta/icons/IconFunnel'
import { IconRevert } from '@consta/icons/IconRevert'
import { Button } from '@consta/uikit/Button'
import { Popover } from '@consta/uikit/Popover'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'

import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from './constants'
import { SORT_BY_ITEMS, SORT_ORDER_ITEMS } from './select-options'
import { type TagResponse, tagsListQuery } from '@/entities/template-tags'
import { type SortOrder, type TemplatesSortBy } from '@/entities/templates'

export interface FiltersState {
	sortBy: TemplatesSortBy
	sortOrder: SortOrder
	tags: string[]
}

interface FiltersPopoverProps {
	filters: FiltersState
	onFiltersChange: (filters: Partial<FiltersState>) => void
	onClear: () => void
}

export function FiltersPopover({
	filters,
	onFiltersChange,
	onClear
}: FiltersPopoverProps) {
	const anchorRef = useRef<HTMLButtonElement>(null)
	const [isPopoverVisible, setIsPopoverVisible] = useState(false)
	const { data: allTags, isLoading: tagsLoading } = useQuery(
		tagsListQuery({ type: 'templates' })
	)

	const isFiltered = useMemo(() => {
		const isSortByAltered = filters.sortBy !== DEFAULT_SORT_BY
		const isSortOrderAltered = filters.sortOrder !== DEFAULT_SORT_ORDER
		const areTagsApplied = filters.tags.length > 0
		return isSortByAltered || isSortOrderAltered || areTagsApplied
	}, [filters])

	return (
		<>
			<Button
				label='Фильтры'
				view={isFiltered ? 'primary' : 'ghost'}
				onlyIcon
				iconSize='s'
				iconLeft={IconFunnel}
				onClick={() => setIsPopoverVisible(!isPopoverVisible)}
				ref={anchorRef}
			/>
			{isPopoverVisible && (
				// @ts-ignore
				<Popover
					direction='downStartLeft'
					offset='2xs'
					onClickOutside={() => setIsPopoverVisible(false)}
					anchorRef={anchorRef}
					className='!w-[310px] rounded-lg p-4'
					style={{
						backgroundColor: 'var(--color-bg-default)',
						boxShadow: '0 0 0 1px var(--color-bg-ghost)'
					}}
				>
					<div>
						<div className='relative mb-4 flex items-center'>
							<Text view='primary' weight='semibold'>
								Фильтры
							</Text>
							{isFiltered && (
								<Button
									className='absolute top-0 -right-43'
									view='ghost'
									size='s'
									onlyIcon
									iconLeft={IconRevert}
									onClick={onClear}
								/>
							)}
						</div>
						<div className='flex flex-col gap-y-4'>
							<div>
								<Text view='secondary' size='xs' className='mb-1 block'>
									Сортировка по
								</Text>
								<Select
									items={SORT_BY_ITEMS}
									value={SORT_BY_ITEMS.find(o => o.value === filters.sortBy)}
									onChange={v =>
										onFiltersChange({
											sortBy: v?.value as TemplatesSortBy
										})
									}
									size='s'
								/>
							</div>
							<div>
								<Text view='secondary' size='xs' className='mb-1 block'>
									Порядок сортировки
								</Text>
								<Select
									items={SORT_ORDER_ITEMS}
									value={SORT_ORDER_ITEMS.find(
										o => o.value === filters.sortOrder
									)}
									onChange={v =>
										onFiltersChange({
											sortOrder: v?.value as SortOrder
										})
									}
									size='s'
								/>
							</div>
							<div>
								<Text view='secondary' size='xs' className='mb-1 block'>
									Теги
								</Text>
								<Select
									multiple
									items={allTags || []}
									value={(allTags || []).filter(o =>
										filters.tags.includes(o.name)
									)}
									onChange={(v: TagResponse[] | null) =>
										onFiltersChange({
											tags: v?.map(o => o.name) || []
										})
									}
									getItemLabel={(item: TagResponse) => item.name}
									getItemKey={(item: TagResponse) => item.id}
									placeholder='Выберите теги'
									size='s'
									disabled={tagsLoading}
								/>
							</div>
						</div>
					</div>
				</Popover>
			)}
		</>
	)
}
