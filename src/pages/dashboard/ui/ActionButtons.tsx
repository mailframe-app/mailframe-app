import { useState } from 'react'

import { useCreateCampaignModal } from '@/features/campaign/create-campaign'
import { useCreateTemplateAction } from '@/features/templates-actions/create-template'

import { PRIVATE_ROUTES } from '@/shared/constants'

import contacts from '../assets/contacts.png'
import dot from '../assets/dot.png'
import template from '../assets/template.png'

import { CardLink } from './CardLink'
import { ActionsCreateModal } from '@/widgets/CreateContactsModal'

const ActionButtons = () => {
	const [hoveredCard, setHoveredCard] = useState<number>(1)
	const [isContactsModalOpen, setIsContactsModalOpen] = useState(false)

	const { handleCreate: handleCreateTemplate } = useCreateTemplateAction()
	const { openCreateCampaignModal } = useCreateCampaignModal()

	const handleContactsButtonClick = () => {
		setIsContactsModalOpen(true)
	}

	const handleTemplateButtonClick = () => {
		handleCreateTemplate()
	}

	const handleCampaignButtonClick = () => {
		openCreateCampaignModal()
	}

	return (
		<>
			<ActionsCreateModal
				isOpen={isContactsModalOpen}
				onClose={() => setIsContactsModalOpen(false)}
			/>
			<div className='mb-6 flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0'>
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
					className='md:mr-2'
					onButtonClick={handleContactsButtonClick}
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
					className='md:mr-2'
					onButtonClick={handleTemplateButtonClick}
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
					onButtonClick={handleCampaignButtonClick}
				/>
			</div>
		</>
	)
}

export { ActionButtons }
