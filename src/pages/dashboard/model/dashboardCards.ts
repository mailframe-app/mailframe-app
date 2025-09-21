import { PRIVATE_ROUTES } from '@/shared/constants'

import contacts from '../assets/contacts.png'
import dot from '../assets/dot.png'
import template from '../assets/template.png'
import type { DashboardCardData } from '../types'
import { CardId } from '../types'

export const dashboardCards: DashboardCardData[] = [
	{
		id: CardId.CONTACTS,
		title: 'Контакты',
		text: 'Добавить',
		description:
			'Загрузка контактов вручную или импорт, а также работа с группами и фильтрами',
		imageUrl: contacts,
		position: 'image-bottom',
		url: PRIVATE_ROUTES.CONTACTS,
		className: 'md:mr-2'
	},
	{
		id: CardId.TEMPLATES,
		title: 'Шаблоны',
		text: 'Создать',
		description:
			'Разработайте или выберите готовый шаблон письма из библиотеки',
		imageUrl: template,
		position: 'image-top',
		url: PRIVATE_ROUTES.TEMPLATES,
		className: 'md:mr-2'
	},
	{
		id: CardId.CAMPAIGNS,
		title: 'Рассылка',
		text: 'Создать',
		description:
			'Определите тему, выберите список контактов и настройте параметры',
		imageUrl: dot,
		position: 'image-top',
		url: PRIVATE_ROUTES.CAMPANIES
	}
]
