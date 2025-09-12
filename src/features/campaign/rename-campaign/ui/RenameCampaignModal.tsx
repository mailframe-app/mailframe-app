import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useState } from 'react'

import { showCustomToast } from '@/shared/lib'

import { useUpdateCampaignMutation } from '@/entities/campaigns'

export type RenameCampaignModalProps = {
	campaignId: string
	initialName: string
	onClose: () => void
	onRenamed?: (newName: string) => void
}

export function RenameCampaignModal({
	campaignId,
	initialName,
	onClose,
	onRenamed
}: RenameCampaignModalProps) {
	const [campaignName, setCampaignName] = useState(initialName)
	const updateCampaignMutation = useUpdateCampaignMutation()

	useEffect(() => {
		setCampaignName(initialName)
	}, [initialName])

	const handleSubmit = async () => {
		const newName = campaignName.trim()
		if (!newName || newName === initialName) {
			onClose()
			return
		}

		try {
			const updatedCampaign = await updateCampaignMutation.mutateAsync({
				id: campaignId,
				payload: { name: newName }
			})
			showCustomToast({
				title: 'Название рассылки обновлено',
				type: 'success'
			})
			onRenamed?.(updatedCampaign.name)
			onClose()
		} catch (error) {
			showCustomToast({
				title: 'Ошибка при обновлении названия',
				type: 'error'
			})
		}
	}

	return (
		<div className='space-y-4'>
			<div>
				<Text size='s' view='secondary' className='mb-2'>
					Новое название рассылки
				</Text>
				<TextField
					placeholder='Введите название'
					value={campaignName}
					onChange={value => setCampaignName(value || '')}
					className='w-full'
					autoFocus
					onKeyDown={e => {
						if (e.key === 'Enter') handleSubmit()
					}}
				/>
			</div>

			<div className='flex justify-end gap-3 pt-4'>
				<Button
					view='ghost'
					label='Отмена'
					onClick={onClose}
					disabled={updateCampaignMutation.isPending}
				/>
				<Button
					view='primary'
					label='Сохранить'
					onClick={handleSubmit}
					disabled={!campaignName.trim() || updateCampaignMutation.isPending}
				/>
			</div>
		</div>
	)
}
