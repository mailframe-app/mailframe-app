import { IconAdd } from '@consta/icons/IconAdd'
import { IconKebab } from '@consta/icons/IconKebab'
import { IconSettings } from '@consta/icons/IconSettings'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
	ContactsTab,
	type ContactsTabHandle
} from './ui/ContactsTab/ContactsTab'
import GroupsTab, { type GroupsTabHandle } from './ui/GroupsTab'

const TABS = [
	{ id: 'all', label: 'Все контакты' },
	{ id: 'groups', label: 'Группа контактов' }
]

function ContactsPage() {
	const [searchParams, setSearchParams] = useSearchParams()
	const groupsTabRef = useRef<GroupsTabHandle>(null)
	const contactsTabRef = useRef<ContactsTabHandle>(null)
	const settingsButtonRef = useRef<any>(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const activeTab = searchParams.get('tab') || 'all'
	const handleTabChange = (tab: { id: string }) => {
		setSearchParams({ tab: tab.id })
	}

	const menuItems = [
		{ label: 'Настройки таблицы', key: 'settings', icon: IconSettings },
		{
			label: 'Корзина контактов',
			key: 'trash',
			icon: IconTrash,
			view: 'alert'
		}
	]

	const handleMenuClick = (item: { key: string }) => {
		if (item.key === 'settings') {
			contactsTabRef.current?.openTableSettings()
		} else if (item.key === 'trash') {
			contactsTabRef.current?.openTrashModal()
		}
		setIsMenuOpen(false)
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
						Контакты
					</Text>
					<Text as='p' view='secondary' size='s'>
						Управляйте контактами и группами контактов.
					</Text>
				</div>
				<div className='flex items-center gap-3'>
					{activeTab === 'all' ? (
						<>
							<Button
								onlyIcon
								iconLeft={IconKebab}
								view='clear'
								className='!border !border-[var(--color-control-bg-border-default)]'
								size='m'
								ref={settingsButtonRef}
								onClick={() => setIsMenuOpen(true)}
							/>
							<ContextMenu
								isOpen={isMenuOpen}
								items={menuItems}
								getItemLeftIcon={item => item.icon}
								getItemStatus={item => item.view as any}
								getItemKey={item => item.key}
								getItemLabel={item => item.label}
								anchorRef={settingsButtonRef}
								onClickOutside={() => setIsMenuOpen(false)}
								onItemClick={handleMenuClick}
								direction='downStartRight'
								offset='xs'
							/>
							<Button
								label='Добавить контакты'
								view='primary'
								iconLeft={IconAdd}
								onClick={() => contactsTabRef.current?.openCreateModal()}
							/>
						</>
					) : (
						<Button
							label='Создать группу'
							view='primary'
							iconLeft={IconAdd}
							onClick={() => groupsTabRef.current?.openCreate()}
						/>
					)}
				</div>
			</div>

			<div className='mb-4 flex gap-2'>
				{TABS.map(tab => (
					<Button
						key={tab.id}
						label={tab.label}
						view={activeTab === tab.id ? 'primary' : 'clear'}
						size='m'
						onClick={() => handleTabChange(tab)}
						className={activeTab === tab.id ? '' : ''}
						style={{
							background: activeTab === tab.id ? 'var(--color-bg-default)' : '',
							color:
								activeTab === tab.id
									? 'var(--color-control-typo-secondary)'
									: '',
							borderRadius: '10px',
							fontWeight: activeTab === tab.id ? '500' : '400'
						}}
					/>
				))}
			</div>

			<Layout direction='column' className='w-full items-stretch'>
				{activeTab === 'all' && <ContactsTab ref={contactsTabRef} />}
				{activeTab === 'groups' && <GroupsTab ref={groupsTabRef} />}
			</Layout>
		</Layout>
	)
}

export const Component = ContactsPage
