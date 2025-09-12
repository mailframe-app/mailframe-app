import { Layout } from '@consta/uikit/Layout'
import { useState } from 'react'

import { PRIVATE_ROUTES } from '@/shared/constants'

import contacts from '../assets/contacts.png'
import dot from '../assets/dot.png'
import template from '../assets/template.png'

import { CardLink } from './CardLink'

const ActionButtons = () => {
	const [hoveredCard, setHoveredCard] = useState<number>(1)
	return (
		<Layout direction='row' className='mb-8 gap-4'>
			<CardLink
				key={1}
				title='Контакты'
				isHovered={hoveredCard === 1}
				onHover={() => setHoveredCard(1)}
				text='Добавить'
				description='Загрузка контактов вручную или импорт, а&nbsp;также работа с&nbsp;группами и&nbsp;фильтрами'
				imageUrl={contacts}
				url={PRIVATE_ROUTES.CONTACTS}
				position='image-bottom'
			/>

			<CardLink
				key={2}
				title='Шаблоны'
				isHovered={hoveredCard === 2}
				onHover={() => setHoveredCard(2)}
				text='Создать'
				description='Разработайте или выберите готовый шаблон письма из&nbsp;библиотеки'
				imageUrl={template}
				position='image-top'
				url={PRIVATE_ROUTES.TEMPLATES}
			/>
			<CardLink
				key={3}
				title='Рассылка'
				isHovered={hoveredCard === 3}
				onHover={() => setHoveredCard(3)}
				text='Создать'
				description='Определите тему, выберите список контактов и&nbsp;настройте параметры'
				imageUrl={dot}
				position='image-top'
				url={PRIVATE_ROUTES.CAMPANIES}
			/>
		</Layout>
	)
}

export { ActionButtons }
