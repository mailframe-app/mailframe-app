import { IconAdd } from '@consta/icons/IconAdd'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { Tabs } from '@consta/uikit/Tabs'
import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useCreateTemplateAction } from '@/features/templates-actions/create-template'

import {
	DEFAULT_SORT_BY,
	DEFAULT_SORT_ORDER,
	DEFAULT_TAB
} from './model/constants'
import { NamedTemplateGrid } from './ui/NamedTemplateGrid'
import { NamedTemplateGridSkeleton } from './ui/NamedTemplateGridSkeleton'
import { SearchAndFilters } from './ui/SearchAndFilters'
import { TemplateGrid } from './ui/TemplateGrid'
import { TemplateGridSkeleton } from './ui/TemplateGridSkeleton'
import {
	type GetTemplatesResponse,
	type SortOrder,
	type TemplatesSortBy,
	type TemplatesTab,
	useTemplatesList
} from '@/entities/templates'

interface Tab {
	id: string
	label: string
}

const items: Tab[] = [
	{ id: 'library', label: 'Библиотека' },
	{ id: 'my-templates', label: 'Мои шаблоны' }
]

function TemplatesView({
	tabId,
	data,
	isError,
	isLoading
}: {
	tabId: string
	data: GetTemplatesResponse | undefined
	isError: boolean
	isLoading: boolean
}) {
	const { handleCreate } = useCreateTemplateAction()

	if (isLoading) {
		if (tabId === 'library') {
			return <NamedTemplateGridSkeleton count={8} />
		}
		return <TemplateGridSkeleton count={8} />
	}

	const favoriteTemplates = data?.favoriteTemplates || []
	const regularTemplates = data?.templates || []

	if (isError) {
		return (
			<div className='p-4 text-sm text-red-500'>
				Не удалось загрузить шаблоны. Попробуйте обновить страницу.
			</div>
		)
	}

	if (favoriteTemplates.length === 0 && regularTemplates.length === 0) {
		if (tabId === 'my-templates') {
			return (
				<div className='flex w-full justify-center py-10'>
					<ResponsesEmptyPockets
						size='m'
						title='Здесь нет шаблонов'
						description='Создайте шаблон с нуля или воспользуйтесь готовыми решениями из библиотеки'
						actions={
							<Button
								size='m'
								view='primary'
								label='Создать шаблон'
								onClick={handleCreate}
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
					title='Здесь нет шаблонов'
					description='Не расстраивайтесь, вы можете создать свой шаблон и добавить его в библиотеку'
					actions={
						<Button
							size='m'
							view='ghost'
							label='Очистить поиск'
							onClick={() =>
								window.dispatchEvent(new Event('clear-template-filters'))
							}
						/>
					}
				/>
			</div>
		)
	}

	return (
		<>
			{favoriteTemplates.length > 0 && (
				<div className='mb-8'>
					<Text view='primary' size='xl' weight='semibold' className='mb-4'>
						Избранные
					</Text>
					{tabId === 'library' ? (
						<NamedTemplateGrid templates={favoriteTemplates} tabId={tabId} />
					) : (
						<TemplateGrid
							templates={favoriteTemplates}
							tabId={tabId as 'library' | 'my-templates'}
						/>
					)}
				</div>
			)}
			{regularTemplates.length > 0 && (
				<div>
					<Text view='primary' size='xl' weight='semibold' className='mb-4'>
						{tabId === 'my-templates' ? 'Мои шаблоны' : 'Библиотека'}
					</Text>
					{tabId === 'library' ? (
						<NamedTemplateGrid templates={regularTemplates} tabId={tabId} />
					) : (
						<TemplateGrid
							templates={regularTemplates}
							tabId={tabId as 'library' | 'my-templates'}
						/>
					)}
				</div>
			)}
		</>
	)
}

function TemplatesPage() {
	const [searchParams, setSearchParams] = useSearchParams()
	const { handleCreate } = useCreateTemplateAction()

	const activeTabId = searchParams.get('tab') || DEFAULT_TAB
	const search = searchParams.get('search') || undefined
	const sortBy =
		(searchParams.get('sortBy') as TemplatesSortBy) || DEFAULT_SORT_BY
	const sortOrder =
		(searchParams.get('sortOrder') as SortOrder) || DEFAULT_SORT_ORDER
	const tags = searchParams.getAll('tags') || undefined

	const apiTab = (
		activeTabId === 'my-templates' ? 'my' : 'library'
	) as TemplatesTab

	const { data, isError, isLoading } = useTemplatesList({
		tab: apiTab,
		search,
		sortBy,
		sortOrder,
		tags: tags && tags.length > 0 ? tags : undefined
	})

	const activeTab = useMemo(
		() => items.find(tab => tab.id === activeTabId) || items[0],
		[activeTabId]
	)

	const handleTabChange = (tab: Tab) => {
		const newParams = new URLSearchParams()
		newParams.set('tab', tab.id)
		newParams.set('sortBy', DEFAULT_SORT_BY)
		newParams.set('sortOrder', DEFAULT_SORT_ORDER)
		setSearchParams(newParams, { replace: true })
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
						Шаблоны
					</Text>
					<Text as='p' view='secondary' size='s'>
						Создавайте и управляйте шаблонами писем.
					</Text>
				</div>
				<Button
					label='Создать шаблон'
					view='primary'
					iconLeft={IconAdd}
					onClick={handleCreate}
				/>
			</div>

			<div className='w-full'>
				<Tabs
					view='clear'
					value={activeTab}
					onChange={handleTabChange}
					items={items}
					getItemLabel={(item: Tab) => item.label}
					getItemKey={(item: Tab) => item.id}
					className='custom-tab'
				/>
			</div>
			<SearchAndFilters tabId={activeTab.id} />

			<TemplatesView
				tabId={activeTab.id}
				data={data}
				isError={isError}
				isLoading={isLoading}
			/>
		</Layout>
	)
}

export const Component = TemplatesPage
