import { IconBackward } from '@consta/icons/IconBackward'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { openCreateContactModal } from '@/features/contacts/contact-create'
import { useImportHistoryModal } from '@/features/import-contacts/history'

import { PRIVATE_ROUTES } from '@/shared/constants'

import ImportTab from './ui/CreatePageTabs/ImportTab'
import ManualTab from './ui/CreatePageTabs/ManualTab'

function CreateContactsPage() {
	const navigate = useNavigate()
	const location = useLocation()

	type Tab = { id: 'manual' | 'import'; label: string }
	const tabs: Tab[] = useMemo(
		() => [
			{ id: 'manual', label: 'Вручную' },
			{ id: 'import', label: 'Импорт из файла' }
		],
		[]
	)

	const [activeTab, setActiveTab] = useState<Tab>(tabs[0])

	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const t = params.get('tab') as Tab['id'] | null
		if (t) {
			const found = tabs.find(x => x.id === t)
			if (found) setActiveTab(found)
		}
	}, [location.search, tabs])

	const { openImportHistoryModal } = useImportHistoryModal()
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
						Добавление контактов
					</Text>
					<Text as='p' view='secondary' size='s'>
						Добавьте контакты вручную или импортируйте их из файла.
					</Text>
				</div>
				<div className='flex items-center gap-3'>
					<Button
						view='clear'
						label='Назад'
						iconLeft={IconBackward}
						onClick={() => navigate(PRIVATE_ROUTES.CONTACTS)}
						className='cursor-pointer !border !border-[var(--color-bg-ghost)]'
					/>
					{activeTab.id === 'manual' ? (
						<Button
							view='primary'
							label='Быстрый контакт'
							onClick={openCreateContactModal}
						/>
					) : (
						<Button
							view='primary'
							label='История импорта'
							onClick={openImportHistoryModal}
						/>
					)}
				</div>
			</div>
			<div className='mb-2 flex gap-2'>
				{tabs.map(tab => (
					<Button
						key={tab.id}
						label={tab.label}
						view={activeTab.id === tab.id ? 'primary' : 'clear'}
						size='m'
						onClick={() => {
							setActiveTab(tab)
							const params = new URLSearchParams(location.search)
							params.set('tab', tab.id)
							navigate({ search: params.toString() }, { replace: true })
						}}
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

			{activeTab.id === 'manual' && <ManualTab />}

			{activeTab.id === 'import' && <ImportTab />}
		</Layout>
	)
}

export const Component = CreateContactsPage
