import { IconFunnel } from '@consta/icons/IconFunnel'
import { IconRevert } from '@consta/icons/IconRevert'
import { Button } from '@consta/uikit/Button'
import { Popover } from '@consta/uikit/Popover'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from './constants'
import { SORT_BY_ITEMS, SORT_ORDER_ITEMS } from './select-options'
import { tagsListQuery } from '@/entities/template-tags'

export function FiltersPopover() {
	const anchorRef = useRef<HTMLButtonElement>(null)
	const [isPopoverVisible, setIsPopoverVisible] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const { data: allTags, isLoading: tagsLoading } = useQuery(
		tagsListQuery({ type: 'templates' })
	)

	const sortByValue = searchParams.get('sortBy') || DEFAULT_SORT_BY
	const sortOrderValue = searchParams.get('sortOrder') || DEFAULT_SORT_ORDER
	const tagsValue = searchParams.getAll('tags') || []

	const isFiltered = useMemo(() => {
		const isSortByAltered = sortByValue !== DEFAULT_SORT_BY
		const isSortOrderAltered = sortOrderValue !== DEFAULT_SORT_ORDER
		const areTagsApplied = tagsValue.length > 0
		return isSortByAltered || isSortOrderAltered || areTagsApplied
	}, [sortByValue, sortOrderValue, tagsValue])

	const handleUpdateParams = (key: string, value: string | string[]) => {
		const newParams = new URLSearchParams(searchParams)
		if (Array.isArray(value)) {
			newParams.delete(key)
			value.forEach(v => newParams.append(key, v))
		} else {
			newParams.set(key, value)
		}
		setSearchParams(newParams, { replace: true })
	}

	const handleClearFilters = () => {
		const newParams = new URLSearchParams(searchParams)
		newParams.delete('sortBy')
		newParams.delete('sortOrder')
		newParams.delete('tags')
		newParams.delete('search')
		setSearchParams(newParams, { replace: true })
	}

	useEffect(() => {
		const handleClear = () => handleClearFilters()
		window.addEventListener('clear-template-filters', handleClear)
		return () => {
			window.removeEventListener('clear-template-filters', handleClear)
		}
	}, [searchParams])

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
				//@ts-ignore
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
									onClick={handleClearFilters}
								/>
							)}
						</div>
						<div className='flex flex-col gap-y-4'>
							<div>
								<Text view='secondary' size='xs' className='mb-1 block'>
									Сортировка по
								</Text>
								<Select
									items={SORT_BY_ITEMS as any}
									value={SORT_BY_ITEMS.find(
										(o: any) => o.value === sortByValue
									)}
									onChange={(v: any) => handleUpdateParams('sortBy', v!.value)}
									size='s'
								/>
							</div>
							<div>
								<Text view='secondary' size='xs' className='mb-1 block'>
									Порядок сортировки
								</Text>
								<Select
									items={SORT_ORDER_ITEMS as any}
									value={SORT_ORDER_ITEMS.find(
										(o: any) => o.value === sortOrderValue
									)}
									onChange={(v: any) =>
										handleUpdateParams('sortOrder', v!.value)
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
									value={(allTags || []).filter((o: any) =>
										tagsValue.includes(o.name)
									)}
									onChange={(v: any) =>
										handleUpdateParams('tags', v?.map((o: any) => o.name) || [])
									}
									getItemLabel={(item: any) => item.name}
									getItemKey={(item: any) => item.id}
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
