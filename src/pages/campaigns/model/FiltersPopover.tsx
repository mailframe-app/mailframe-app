import { IconFilter } from '@consta/icons/IconFilter'
import { IconRevert } from '@consta/icons/IconRevert'
import { Button } from '@consta/uikit/Button'
import { Popover } from '@consta/uikit/Popover'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useTheme } from '@/features/theme'

import { type CampaignStatus } from '@/entities/campaigns'

type SortByItem = {
	label: string
	value: 'updatedAt' | 'createdAt' | 'name'
	id: number
}

const SORT_BY_ITEMS: SortByItem[] = [
	{ label: 'Дате обновления', value: 'updatedAt', id: 1 },
	{ label: 'Дате создания', value: 'createdAt', id: 2 },
	{ label: 'Названию', value: 'name', id: 3 }
]

type SortOrderItem = {
	label: string
	value: 'desc' | 'asc'
	id: number
}

const SORT_ORDER_ITEMS: SortOrderItem[] = [
	{ label: 'По убыванию', value: 'desc', id: 1 },
	{ label: 'По возрастанию', value: 'asc', id: 2 }
]

type StatusItem = {
	label: string
	value: CampaignStatus
	id: CampaignStatus
}

const STATUS_ITEMS: StatusItem[] = [
	{ label: 'Черновик', value: 'DRAFT', id: 'DRAFT' },
	{ label: 'В очереди', value: 'QUEUED', id: 'QUEUED' },
	{ label: 'Запланирована', value: 'SCHEDULED', id: 'SCHEDULED' },
	{ label: 'Отправляется', value: 'SENDING', id: 'SENDING' },
	{ label: 'Отправлена', value: 'SENT', id: 'SENT' },
	{ label: 'Отменена', value: 'CANCELED', id: 'CANCELED' }
]

export function FiltersPopover({ tabId }: { tabId: string }) {
	const anchorRef = useRef<HTMLButtonElement>(null)
	const [isPopoverVisible, setIsPopoverVisible] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const { theme } = useTheme()
	const sortByValue = searchParams.get('sortBy') || SORT_BY_ITEMS[0].value
	const sortOrderValue =
		searchParams.get('sortOrder') || SORT_ORDER_ITEMS[0].value
	const statusesValue = searchParams.getAll('statuses') || []

	const isFiltered = useMemo(() => {
		const isSortByAltered = sortByValue !== SORT_BY_ITEMS[0].value
		const isSortOrderAltered = sortOrderValue !== SORT_ORDER_ITEMS[0].value
		const areStatusesApplied = statusesValue.length > 0
		return isSortByAltered || isSortOrderAltered || areStatusesApplied
	}, [sortByValue, sortOrderValue, statusesValue])

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
		newParams.delete('statuses')
		setSearchParams(newParams, { replace: true })
	}

	return (
		<>
			<Button
				label='Фильтры'
				view='ghost'
				size='m'
				iconSize='s'
				iconLeft={IconFilter}
				onClick={() => setIsPopoverVisible(!isPopoverVisible)}
				ref={anchorRef}
				style={
					{
						'--button-bg-color':
							theme === 'presetGpnDefault'
								? '#F8FAFC'
								: 'var(--color-bg-stripe)',
						'--button-bg-color-disable':
							theme === 'presetGpnDefault'
								? '#F8FAFC'
								: 'var(--color-bg-stripe)'
					} as React.CSSProperties
				}
			/>
			{isPopoverVisible && (
				//@ts-ignore
				<Popover
					direction='downStartRight'
					offset='2xs'
					onClickOutside={() => setIsPopoverVisible(false)}
					anchorRef={anchorRef as any}
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
									items={SORT_BY_ITEMS}
									value={SORT_BY_ITEMS.find(o => o.value === sortByValue)}
									onChange={v => handleUpdateParams('sortBy', v!.value)}
									size='s'
								/>
							</div>
							<div>
								<Text view='secondary' size='xs' className='mb-1 block'>
									Порядок сортировки
								</Text>
								<Select
									items={SORT_ORDER_ITEMS}
									value={SORT_ORDER_ITEMS.find(o => o.value === sortOrderValue)}
									onChange={v => handleUpdateParams('sortOrder', v!.value)}
									size='s'
								/>
							</div>
							{tabId === 'all' && (
								<div>
									<Text view='secondary' size='xs' className='mb-1 block'>
										Статусы
									</Text>
									<Select
										multiple
										items={STATUS_ITEMS}
										value={STATUS_ITEMS.filter(o =>
											statusesValue.includes(o.value)
										)}
										onChange={v =>
											handleUpdateParams('statuses', v?.map(o => o.value) || [])
										}
										placeholder='Выберите статусы'
										size='s'
									/>
								</div>
							)}
						</div>
					</div>
				</Popover>
			)}
		</>
	)
}
