import type { IconComponent } from '@consta/icons/Icon'
import { IconConnection } from '@consta/icons/IconConnection'
import { IconLock } from '@consta/icons/IconLock'
import { IconMail } from '@consta/icons/IconMail'
import { IconUser } from '@consta/icons/IconUser'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants'

type MenuItem = {
	id: string
	label: string
	path: string
	icon: IconComponent
}

const items: MenuItem[] = [
	{
		id: 'profile',
		label: 'Профиль',
		path: PRIVATE_ROUTES.PROFILE,
		icon: IconUser
	},
	{
		id: 'smtp',
		label: 'Настройки SMTP',
		path: PRIVATE_ROUTES.MAIL_SETTINGS,
		icon: IconMail
	},
	{
		id: 'security',
		label: 'Безопасность',
		path: PRIVATE_ROUTES.SECURITY,
		icon: IconLock
	},
	{
		id: 'connections',
		label: 'Интеграции',
		path: PRIVATE_ROUTES.CONNECTIONS,
		icon: IconConnection
	}
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
			<div className='mb-7 flex items-center justify-between'>
				<div className='flex flex-col'>
					<Text
						as='h1'
						view='primary'
						size='xl'
						weight='semibold'
						className='leading-6'
					>
						Настройки
					</Text>
					<Text as='p' view='secondary' size='s'>
						Управление настройками вашего аккаунта.
					</Text>
				</div>
			</div>
			<div className='mb-4 flex gap-2'>
				{items.map(item => (
					<Button
						key={item.id}
						label={item.label}
						view={activeTab?.id === item.id ? 'primary' : 'clear'}
						size='m'
						// iconLeft={item.icon}
						onClick={() => handleChange(item)}
						className={activeTab?.id === item.id ? '' : ''}
						style={{
							background:
								activeTab?.id === item.id ? 'var(--color-bg-default)' : '',
							color:
								activeTab?.id === item.id
									? 'var(--color-control-typo-secondary)'
									: '',
							borderRadius: '10px',
							fontWeight: activeTab?.id === item.id ? '500' : '400'
						}}
					/>
				))}
			</div>
			<Outlet />
		</Layout>
	)
}
