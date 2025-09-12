import { Layout } from '@consta/uikit/Layout'
import { Tabs } from '@consta/uikit/Tabs'
import { Text } from '@consta/uikit/Text'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants'

type MenuItem = {
	id: string
	label: string
	path: string
}

const items: MenuItem[] = [
	{ id: 'profile', label: 'Профиль', path: PRIVATE_ROUTES.PROFILE },
	{
		id: 'smtp',
		label: 'Настройки SMTP',
		path: PRIVATE_ROUTES.MAIL_SETTINGS
	},
	{ id: 'security', label: 'Безопасность', path: PRIVATE_ROUTES.SECURITY },
	{ id: 'connections', label: 'Интеграции', path: PRIVATE_ROUTES.CONNECTIONS }
]

export function SettingsLayout() {
	const navigate = useNavigate()
	const location = useLocation()
	const [activeTab, setActiveTab] = useState<MenuItem | undefined>(() => {
		return items.find(item => location.pathname.startsWith(item.path))
	})

	useEffect(() => {
		setActiveTab(items.find(item => location.pathname.startsWith(item.path)))
	}, [location.pathname])

	const handleChange = (item: MenuItem) => {
		setActiveTab(item)
		navigate(item.path)
	}

	return (
		<Layout direction='column' className='w-full'>
			<div className='flex items-center justify-between'>
				<Text view='primary' size='3xl' weight='bold' className='mb-8'>
					Настройки
				</Text>
			</div>
			<div className='w-full'>
				{activeTab && (
					<Tabs
						view='clear'
						value={activeTab}
						onChange={handleChange}
						items={items}
						getItemLabel={item => item.label}
						getItemKey={item => item.id}
						className='custom-tab mb-8'
					/>
				)}
			</div>
			<Outlet />
		</Layout>
	)
}
