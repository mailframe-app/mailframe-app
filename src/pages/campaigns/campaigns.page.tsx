import { IconAdd } from '@consta/icons/IconAdd'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { Select } from '@consta/uikit/Select'
import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useCreateCampaignModal } from '@/features/campaign/create-campaign'

import { TablePagination } from '@/shared/ui'

import { USE_MOCK_DATA, getFilteredMockData } from './model/screenshot-data'
import { CampaignGrid } from './ui/CampaignGrid'
import { CampaignGridSkeleton } from './ui/CampaignGridSkeleton'
import { SearchAndFilters } from './ui/SearchAndFilters'
import {
	type CampaignListItem,
	type CampaignStatus,
	type CampaignsSortBy,
	useCampaigns
} from '@/entities/campaigns'
import { type SortOrder } from '@/entities/templates'

interface Tab {
	id: string
	label: string
	status?: CampaignStatus[]
}

const items: Tab[] = [
	{ id: 'all', label: 'Все рассылки' },
	{ id: 'draft', label: 'Черновики', status: ['DRAFT'] },
	{ id: 'scheduled', label: 'Запланированные', status: ['SCHEDULED'] },
	{ id: 'sending', label: 'В очереди', status: ['QUEUED', 'SENDING'] },
	{ id: 'completed', label: 'Завершенные', status: ['SENT'] },
	{ id: 'archived', label: 'Отменённые', status: ['CANCELED'] }
]

function CampaignsView({
	data,
	isLoading,
	isError,
	limit,
	onClearSearch,
	hasFilters,
	onCreateCampaign
}: {
	data:
		| {
				page: number
				limit: number
				total: number
				items: CampaignListItem[]
		  }
		| undefined
	isLoading: boolean
	isError: boolean
	limit: number
	onClearSearch: () => void
	hasFilters: boolean
	onCreateCampaign: () => void
}) {
	if (isLoading) {
		return <CampaignGridSkeleton count={limit} />
	}

	if (isError) {
		return (
			<div className='p-4 text-sm text-red-500'>
				Не удалось загрузить рассылки. Попробуйте обновить страницу.
			</div>
		)
	}

	const campaigns = data?.items || []

	if (campaigns.length === 0) {
		if (hasFilters) {
			return (
				<div className='flex w-full justify-center py-10'>
					<ResponsesEmptyPockets
						size='m'
						title='По заданным условиям ничего не найдено'
						description='Попробуйте изменить условия поиска'
						actions={
							<Button
								size='m'
								view='ghost'
								label='Очистить фильтры'
								onClick={onClearSearch}
							/>
						}
					/>
				</div>
			)
		}
		return (
			<div className='flex w-full justify-center py-10'>
				<ResponsesEmptyPockets
					size='m'
					title='Здесь нет рассылок'
					description='Создайте свою первую рассылку, чтобы начать'
					actions={
						<Button
							size='m'
							view='primary'
							label='Создать рассылку'
							iconLeft={IconAdd}
							onClick={onCreateCampaign}
						/>
					}
				/>
			</div>
		)
	}

	return <CampaignGrid campaigns={campaigns} />
}

function CampaignsPage() {
	const [searchParams, setSearchParams] = useSearchParams()
	const { openCreateCampaignModal } = useCreateCampaignModal()

	const activeTabId = searchParams.get('tab') || items[0].id
	const search = searchParams.get('search') || ''
	const sortBy = (searchParams.get('sortBy') as CampaignsSortBy) || 'createdAt'
	const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc'
	const page = Number(searchParams.get('page')) || 1
	const limit = Number(searchParams.get('limit')) || 10
	const statuses = searchParams.getAll('statuses') as CampaignStatus[]

	const activeTab = useMemo(
		() => items.find(tab => tab.id === activeTabId) || items[0],
		[activeTabId]
	)

	const hasFilters =
		search !== '' ||
		statuses.length > 0 ||
		sortBy !== 'createdAt' ||
		sortOrder !== 'desc'

	// Использование mock данных для скриншота
	const isMockMode = USE_MOCK_DATA

	let data: ReturnType<typeof getFilteredMockData> | undefined = undefined
	let isLoading = false
	let isError = false

	if (isMockMode) {
		// Mock данные для скриншота
		data = getFilteredMockData({
			activeTab,
			statuses,
			search,
			sortBy,
			sortOrder,
			page,
			limit
		})
		isLoading = false
		isError = false
	} else {
		// Рабочий код с реальными данными
		const queryResult = useCampaigns({
			status: activeTab.status ?? statuses,
			search: search || undefined,
			sortBy,
			sortOrder,
			page,
			limit
		})
		data = queryResult.data ?? undefined
		isLoading = queryResult.isLoading
		isError = queryResult.isError
	}

	const handleTabChange = (tab: Tab | null) => {
		if (tab) {
			setSearchParams({ tab: tab.id })
		}
	}

	const handleClearSearch = () => {
		const newParams = new URLSearchParams(searchParams)
		newParams.delete('search')
		newParams.delete('sortBy')
		newParams.delete('sortOrder')
		newParams.delete('page')
		newParams.delete('limit')
		newParams.delete('statuses')
		setSearchParams(newParams, { replace: true })
	}

	const handlePageChange = (offset: number) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('page', String(offset / limit + 1))
		setSearchParams(newParams)
	}

	const handleStepChange = (step: number) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('limit', String(step))
		newParams.set('page', '1')
		setSearchParams(newParams)
	}

	return (
		<Layout direction='column' className='w-full'>
			<div className='mb-7 flex items-center justify-between'>
				<div className='flex flex-col'>
					<Text
						as='h1'
						view='primary'
						size='xl'
						weight='semibold'
						className='leading-6'
					>
						Рассылки
					</Text>
					<Text as='p' view='secondary' size='s'>
						Создавайте и управляйте рассылками.
					</Text>
				</div>
				<Button
					label='Создать рассылку'
					view='primary'
					iconLeft={IconAdd}
					onClick={openCreateCampaignModal}
				/>
			</div>
			{/* Desktop */}
			<div className='mb-2 hidden gap-2 xl:flex'>
				{items.map(tab => (
					<Button
						key={tab.id}
						label={tab.label}
						view={activeTab.id === tab.id ? 'primary' : 'clear'}
						size='m'
						onClick={() => handleTabChange(tab)}
						className={activeTab.id === tab.id ? '' : ''}
						style={{
							background:
								activeTab.id === tab.id ? 'var(--color-bg-default)' : '',
							color:
								activeTab.id === tab.id
									? 'var(--color-control-typo-secondary)'
									: '',
							borderRadius: '10px',
							fontWeight: activeTab.id === tab.id ? '500' : '400'
						}}
					/>
				))}
			</div>
			{/* Mobile */}
			<div className='mb-4 xl:hidden'>
				<Select
					size='l'
					placeholder='Выберите категорию'
					items={items}
					value={activeTab}
					onChange={handleTabChange}
					getItemKey={item => item.id}
					getItemLabel={item => item.label}
					className='select-no-border'
				/>
			</div>
			<Card
				verticalSpace='l'
				horizontalSpace='l'
				shadow={false}
				className='flex h-full w-full flex-col !rounded-lg bg-[var(--color-bg-default)]'
			>
				<SearchAndFilters tabId={activeTab.id} />
				<CampaignsView
					data={data}
					isLoading={isLoading}
					isError={isError}
					limit={limit}
					onClearSearch={handleClearSearch}
					hasFilters={hasFilters}
					onCreateCampaign={openCreateCampaignModal}
				/>

				{data && data.total > 0 && (
					<div className=''>
						<TablePagination
							total={data.total}
							offset={(page - 1) * limit}
							step={limit}
							onChange={handlePageChange}
							onStepChange={handleStepChange}
						/>
					</div>
				)}
			</Card>
		</Layout>
	)
}

export const Component = CampaignsPage
