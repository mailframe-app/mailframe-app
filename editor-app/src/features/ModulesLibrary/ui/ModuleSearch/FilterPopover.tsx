import { IconRevert } from '@consta/icons/IconRevert'
import { Button } from '@consta/uikit/Button'
import { Popover } from '@consta/uikit/Popover'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import React, { useMemo } from 'react'

import { type FilterItem, SHOW_ITEMS, SORT_BY_ITEMS, SORT_ORDER_ITEMS } from '../../model/constants'
import { useFilterPopover } from '../../model/useFilterPopover'

import type { TagResponseDto } from '@/entities/Tags'

interface FilterPopoverProps {
	anchorRef: React.RefObject<HTMLButtonElement | null>
	isVisible: boolean
	onClickOutside: () => void
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
	anchorRef,
	isVisible,
	onClickOutside
}) => {
	const {
		tags,
		sortBy,
		sortOrder,
		selectedTags,
		handleSortBySelect,
		handleSortOrderSelect,
		handleTagToggle,
		handleShowToggle,
		isShowItemActive,
		resetFilters
	} = useFilterPopover()

	const isFiltered = useMemo(
		() =>
			selectedTags.length > 0 ||
			sortBy !== 'createdAt' ||
			sortOrder !== 'desc' ||
			!isShowItemActive(SHOW_ITEMS[0]) ||
			!isShowItemActive(SHOW_ITEMS[1]) ||
			!isShowItemActive(SHOW_ITEMS[2]),
		[selectedTags, sortBy, sortOrder, isShowItemActive]
	)

	const selectedShowItems = useMemo(() => {
		return SHOW_ITEMS.filter(item => isShowItemActive(item))
	}, [isShowItemActive])

	if (!isVisible) return null

	const handleShowChange = (value: FilterItem[] | null) => {
		const currentIds = new Set(selectedShowItems.map(item => item.id))
		const newIds = value ? new Set(value.map(item => item.id)) : new Set<string>()

		for (const item of value || []) {
			if (!currentIds.has(item.id)) {
				handleShowToggle(item)
				return
			}
		}

		for (const id of currentIds) {
			if (!newIds.has(id)) {
				const itemToToggle = SHOW_ITEMS.find(i => i.id === id)
				if (itemToToggle) {
					handleShowToggle(itemToToggle)
					return
				}
			}
		}
	}

	const handleTagsChange = (value: TagResponseDto[] | null) => {
		const currentSlugs = new Set(selectedTags)
		const newSlugs = value ? new Set(value.map(t => t.slug)) : new Set<string>()

		for (const tag of value || []) {
			if (!currentSlugs.has(tag.slug)) {
				handleTagToggle(tag)
				return
			}
		}

		for (const slug of currentSlugs) {
			if (!newSlugs.has(slug)) {
				const tagToRemove = tags.find(t => t.slug === slug)
				if (tagToRemove) {
					handleTagToggle(tagToRemove)
					return
				}
			}
		}
	}

	return (
		<Popover
			direction='downStartLeft'
			offset='2xs'
			onClickOutside={onClickOutside}
			anchorRef={anchorRef}
			className='!w-[310px] rounded-lg p-4'
			style={{
				zIndex: 100,
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
							onClick={resetFilters}
						/>
					)}
				</div>
				<div className='flex flex-col gap-y-4'>
					<div>
						<Text view='secondary' size='xs' className='mb-1 block'>
							Сортировка по
						</Text>
						<Select<FilterItem>
							items={SORT_BY_ITEMS}
							value={SORT_BY_ITEMS.find(o => o.id === sortBy)}
							onChange={value => value && handleSortBySelect(value)}
							size='s'
							getItemLabel={item => item.label}
						/>
					</div>
					<div>
						<Text view='secondary' size='xs' className='mb-1 block'>
							Порядок сортировки
						</Text>
						<Select<FilterItem>
							items={SORT_ORDER_ITEMS}
							value={SORT_ORDER_ITEMS.find(o => o.id === sortOrder)}
							onChange={value => value && handleSortOrderSelect(value)}
							size='s'
							getItemLabel={item => item.label}
						/>
					</div>
					<div>
						<Text view='secondary' size='xs' className='mb-1 block'>
							Показать
						</Text>
						<Select
							multiple
							items={SHOW_ITEMS}
							value={selectedShowItems}
							onChange={handleShowChange}
							size='s'
							getItemLabel={item => item.label}
							placeholder='Выберите типы'
						/>
					</div>
					{tags.length > 0 && (
						<div>
							<Text view='secondary' size='xs' className='mb-1 block'>
								Теги
							</Text>
							<Select
								multiple
								items={tags}
								value={tags.filter(t => selectedTags.includes(t.slug))}
								onChange={handleTagsChange}
								getItemLabel={item => `${item.name} (${item.usageCount})`}
								placeholder='Выберите теги'
								size='s'
							/>
						</div>
					)}
				</div>
			</div>
		</Popover>
	)
}
