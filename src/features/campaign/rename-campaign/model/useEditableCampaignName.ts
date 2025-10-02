import { useCallback, useState } from 'react'

import { showCustomToast } from '@/shared/lib'

import { useUpdateCampaignMutation } from '@/entities/campaigns'

interface UseEditableCampaignNameParams {
	campaignId: string
	initialName: string
	onNameUpdate: (newName: string) => void
}

export function useEditableCampaignName({
	campaignId,
	initialName,
	onNameUpdate
}: UseEditableCampaignNameParams) {
	const [isEditing, setIsEditing] = useState(false)
	const [localName, setLocalName] = useState(initialName)
	const updateCampaignMutation = useUpdateCampaignMutation()

	const startEditing = () => {
		setLocalName(initialName)
		setIsEditing(true)
	}

	const handleNameSubmit = useCallback(async () => {
		if (localName.trim() && localName !== initialName) {
			try {
				const updatedCampaign = await updateCampaignMutation.mutateAsync({
					id: campaignId,
					payload: { name: localName }
				})
				showCustomToast({
					description: 'Название рассылки обновлено',
					title: 'Успешно',
					type: 'success'
				})
				if (updatedCampaign) {
					onNameUpdate(updatedCampaign.name)
				}
			} catch (error) {
				showCustomToast({
					title: 'Ошибка',
					description: 'Ошибка при обновлении названия',
					type: 'error'
				})
				setLocalName(initialName) // Revert on error
			}
		}
		setIsEditing(false)
	}, [localName, initialName, campaignId, updateCampaignMutation, onNameUpdate])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				handleNameSubmit()
			} else if (event.key === 'Escape') {
				setLocalName(initialName)
				setIsEditing(false)
			}
		},
		[handleNameSubmit, initialName]
	)

	return {
		isEditing,
		localName,
		setLocalName,
		handleNameSubmit,
		handleKeyDown,
		startEditing
	}
}
