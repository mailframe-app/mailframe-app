import { Layout } from '@consta/uikit/Layout'
import { Tabs } from '@consta/uikit/Tabs'
import React, { useMemo, useState } from 'react'

import ModalShell from '@/shared/ui/Modals/ModalShell'

import { FieldEditorTab } from './FieldsEditorTab'
import FieldsReorderTab from './FieldsReorderTab'
import { TrashTab } from './FieldsTrashTab'

export type TableSettingsModalProps = {
	isOpen: boolean
	onClose: () => void
}

const tabs = [
	{ id: 'display', label: 'Отображение' },
	{ id: 'fields', label: 'Редактор полей' },
	{ id: 'trash', label: 'Корзина' }
] as const

type TabId = (typeof tabs)[number]['id']

const TableSettingsModal: React.FC<TableSettingsModalProps> = ({
	isOpen,
	onClose
}) => {
	const [activeTab, setActiveTab] = useState<TabId>('fields')

	const content = useMemo(() => {
		if (activeTab === 'display') return <FieldsReorderTab />
		if (activeTab === 'fields') {
			return <FieldEditorTab />
		}
		return <TrashTab />
	}, [activeTab])

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Настройки таблицы'
			description='Управление порядком и видимостью колонок, создание и редактирование полей.'
			containerClassName='w-[80vw] min-h-[85vh] p-6'
			onClickOutside={onClose}
		>
			<Layout direction='row' className='h-full gap-4'>
				<div className='w-56 shrink-0'>
					<Tabs
						items={tabs as any}
						value={tabs.find(t => t.id === activeTab) as any}
						getItemLabel={(i: any) => i.label}
						onChange={(v: any) => setActiveTab((v?.id as TabId) || 'display')}
						view='clear'
						size='m'
						linePosition='right'
					/>
				</div>
				<div className='min-w-0 flex-1'>{content}</div>
			</Layout>
		</ModalShell>
	)
}

export default TableSettingsModal
