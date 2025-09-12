import { IconAdd } from '@consta/icons/IconAdd'
import { IconKebab } from '@consta/icons/IconKebab'
import { IconSettings } from '@consta/icons/IconSettings'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { Layout } from '@consta/uikit/Layout'
import { Tabs } from '@consta/uikit/Tabs'
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
			<div className='flex items-center justify-between'>
				<Text size='3xl' view='primary' weight='bold'>
					Контакты
				</Text>
				<div className='flex items-center gap-2'>
					{activeTab === 'all' ? (
						<>
							<Button
								onlyIcon
								iconLeft={IconKebab}
								view='ghost'
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

			<div className='children-border-b-0 mt-8 w-full'>
				<Tabs
					items={TABS}
					value={TABS.find(tab => tab.id === activeTab)}
					onChange={handleTabChange}
					view='clear'
				/>
			</div>

			<Layout direction='column' className='w-full items-stretch'>
				{activeTab === 'all' && <ContactsTab ref={contactsTabRef} />}
				{activeTab === 'groups' && <GroupsTab ref={groupsTabRef} />}
			</Layout>
		</Layout>
	)
}

export const Component = ContactsPage
