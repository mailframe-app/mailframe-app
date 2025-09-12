import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useState } from 'react'

import { useCreateCampaign } from '../model/useCreateCampaign'

export type CreateCampaignModalProps = {
	onClose: () => void
	onCreated?: (campaign: any) => void
}

export function CreateCampaignModal({
	onClose,
	onCreated
}: CreateCampaignModalProps) {
	const { create, isPending } = useCreateCampaign()
	const [campaignName, setCampaignName] = useState('')

	const handleSubmit = async () => {
		if (!campaignName.trim()) return

		try {
			const campaign = await create({ name: campaignName })
			onCreated?.(campaign)
			onClose()
		} catch (error) {}
	}

	return (
		<div className='space-y-4'>
			<div>
				<Text size='s' view='secondary' className='mb-2'>
					Название рассылки
				</Text>
				<TextField
					placeholder='Введите название рассылки'
					value={campaignName}
					onChange={value => setCampaignName(value || '')}
					className='w-full'
				/>
			</div>

			<div className='flex justify-end gap-3 pt-4'>
				<Button
					view='ghost'
					label='Отмена'
					onClick={onClose}
					disabled={isPending}
				/>
				<Button
					view='primary'
					label='Создать'
					onClick={handleSubmit}
					disabled={!campaignName.trim() || isPending}
				/>
			</div>
		</div>
	)
}
