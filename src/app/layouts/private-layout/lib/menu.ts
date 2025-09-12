import { IconAreaChart } from '@consta/icons/IconAreaChart'
import { IconDocFilled } from '@consta/icons/IconDocFilled'
import { IconExit } from '@consta/icons/IconExit'
import { IconHome } from '@consta/icons/IconHome'
import { IconMail } from '@consta/icons/IconMail'
import { IconOperators } from '@consta/icons/IconOperators'
import { IconQuestion } from '@consta/icons/IconQuestion'
import { IconSettings } from '@consta/icons/IconSettings'

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/shared/constants'

import type { AppNavbarItem } from './types'

export const appMenuItems: AppNavbarItem[] = [
	{ id: PRIVATE_ROUTES.DASHBOARD, label: 'Главная', icon: IconHome },
	{ id: PRIVATE_ROUTES.CONTACTS, label: 'Контакты', icon: IconOperators },
	{ id: PRIVATE_ROUTES.TEMPLATES, label: 'Шаблоны', icon: IconDocFilled },
	{ id: PRIVATE_ROUTES.CAMPANIES, label: 'Рассылки', icon: IconMail },
	{ id: PRIVATE_ROUTES.ANALYTICS, label: 'Аналитика', icon: IconAreaChart },
	{ id: PRIVATE_ROUTES.PROFILE, label: 'Настройки', icon: IconSettings },
	{
		id: PUBLIC_ROUTES.DOCS,
		label: 'Помощь',
		icon: IconQuestion,
		target: '_blank'
	}
]

export const logoutMenuItem: AppNavbarItem = {
	id: 'logout',
	label: 'Выход',
	icon: IconExit
}
