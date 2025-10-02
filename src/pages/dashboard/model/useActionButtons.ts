import { useCallback, useMemo, useState } from 'react'

import { useCreateCampaignModal } from '@/features/campaign/create-campaign'
import { useCreateTemplateAction } from '@/features/templates-actions/create-template'

import type { CardIdType, UseActionButtonsReturn } from '../types'
import { CardId } from '../types'

/**
 * Хук для управления состоянием и действиями кнопок на панели управления
 *
 * @returns Объект с состоянием и обработчиками для кнопок действий
 */
export const useActionButtons = (): UseActionButtonsReturn => {
	// Состояние для отслеживания активной карточки
	const [hoveredCard, setHoveredCard] = useState<CardIdType>(CardId.CONTACTS)

	// Состояние модального окна контактов
	const [isContactsModalOpen, setIsContactsModalOpen] = useState(false)

	// Хуки для действий с шаблонами и кампаниями
	const { handleCreate: handleCreateTemplate } = useCreateTemplateAction()
	const { openCreateCampaignModal } = useCreateCampaignModal()

	const handleContactsButtonClick = useCallback(() => {
		setIsContactsModalOpen(true)
	}, [])

	const handleTemplateButtonClick = useCallback(() => {
		handleCreateTemplate()
	}, [handleCreateTemplate])

	const handleCampaignButtonClick = useCallback(() => {
		openCreateCampaignModal()
	}, [openCreateCampaignModal])

	return useMemo(
		() => ({
			hoveredCard,
			setHoveredCard,
			isContactsModalOpen,
			setIsContactsModalOpen,
			handleContactsButtonClick,
			handleTemplateButtonClick,
			handleCampaignButtonClick
		}),
		[
			hoveredCard,
			setHoveredCard,
			isContactsModalOpen,
			setIsContactsModalOpen,
			handleContactsButtonClick,
			handleTemplateButtonClick,
			handleCampaignButtonClick
		]
	)
}
