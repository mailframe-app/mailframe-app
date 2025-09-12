import { IconBackward } from '@consta/icons/IconBackward'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Tabs } from '@consta/uikit/Tabs'
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
			<div className='flex items-center justify-between gap-2 py-3'>
				<div className='flex items-center gap-4'>
					<Button
						onlyIcon
						view='ghost'
						iconLeft={IconBackward}
						onClick={() => navigate(PRIVATE_ROUTES.CONTACTS)}
						className='cursor-pointer'
					/>
					<Text size='3xl' weight='bold' view='primary'>
						Добавление нового контакта
					</Text>
				</div>
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
			<div className='children-border-b-0 mt-2 w-full'>
				<Tabs
					items={tabs}
					value={activeTab}
					onChange={(v: Tab) => {
						setActiveTab(v)
						const params = new URLSearchParams(location.search)
						params.set('tab', v.id)
						navigate({ search: params.toString() }, { replace: true })
					}}
					view='clear'
				/>
			</div>

			{activeTab.id === 'manual' && <ManualTab />}

			{activeTab.id === 'import' && <ImportTab />}
		</Layout>
	)
}

export const Component = CreateContactsPage
