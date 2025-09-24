import { memo, useCallback, useMemo } from 'react'

import { dashboardCards } from '../model/dashboardCards'
import { useActionButtons } from '../model/useActionButtons'
import { CardId } from '../types'

import { ActionsCreateModal } from '@/widgets/CreateContactsModal'
import { CardLink } from './card'

const ActionButtons = memo(() => {
	const {
		hoveredCard,
		setHoveredCard,
		isContactsModalOpen,
		setIsContactsModalOpen,
		handleContactsButtonClick,
		handleTemplateButtonClick,
		handleCampaignButtonClick
	} = useActionButtons()

	// Создаем мемоизированный объект с обработчиками для каждой карточки
	const buttonHandlers = useMemo(
		() =>
			({
				[CardId.CONTACTS]: handleContactsButtonClick,
				[CardId.TEMPLATES]: handleTemplateButtonClick,
				[CardId.CAMPAIGNS]: handleCampaignButtonClick
			}) as Record<number, () => void>,
		[
			handleContactsButtonClick,
			handleTemplateButtonClick,
			handleCampaignButtonClick
		]
	)

	// Получаем обработчик для конкретной карточки
	const getButtonHandler = useCallback(
		(id: number) => buttonHandlers[id],
		[buttonHandlers]
	)

	return (
		<>
			<ActionsCreateModal
				isOpen={isContactsModalOpen}
				onClose={() => setIsContactsModalOpen(false)}
			/>
			<div className='mb-6 flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0'>
				{dashboardCards.map(card => (
					<CardLink
						key={card.id}
						title={card.title}
						isHovered={hoveredCard === card.id}
						onHover={() => setHoveredCard(card.id)}
						text={card.text}
						description={card.description}
						imageUrl={card.imageUrl}
						url={card.url}
						position={card.position}
						className={card.className}
						onButtonClick={getButtonHandler(card.id)}
					/>
				))}
			</div>
		</>
	)
})

ActionButtons.displayName = 'ActionButtons'

export { ActionButtons }
