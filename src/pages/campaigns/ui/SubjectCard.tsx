import { IconCheck } from '@consta/icons/IconCheck'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useState } from 'react'

import {
	type CampaignResponse,
	useUpdateCampaignMutation
} from '@/entities/campaigns'

type SubjectCardProps = {
	campaign: CampaignResponse
}

export function SubjectCard({ campaign }: SubjectCardProps) {
	const [subject, setSubject] = useState(campaign.subject || '')
	const updateMutation = useUpdateCampaignMutation()

	// Сбрасываем локальное состояние, если изменился проп снаружи
	useEffect(() => {
		setSubject(campaign.subject || '')
	}, [campaign.subject])

	const handleUpdate = () => {
		if (subject.trim() && subject.trim() !== campaign.subject) {
			updateMutation.mutate({
				id: campaign.id,
				payload: { subject: subject.trim() }
			})
		}
	}

	const isChanged = subject.trim() !== (campaign.subject || '')
	const canSave = subject.trim() && isChanged

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='w-full !rounded-lg'
			style={{
				backgroundColor: 'var(--color-bg-default)'
			}}
			shadow={false}
		>
			<div className='flex items-center justify-between'>
				<Text
					as='h3'
					size='xl'
					weight='semibold'
					className='m-0'
					view='primary'
				>
					Тема письма
				</Text>

				{campaign.subject ? (
					<Badge
						size='l'
						iconLeft={IconCheck}
						form='round'
						className='border-primary text-primary border bg-transparent'
					/>
				) : (
					<Badge
						size='l'
						label='3'
						form='round'
						status='system'
						className='border border-gray-300 bg-transparent text-gray-400'
					/>
				)}
			</div>

			<Text as='p' size='m' view='secondary' className='mb-8'>
				Добавьте название письма
			</Text>

			<Layout direction='row' className='mb-8 items-end gap-6'>
				<div className='flex-grow'>
					<Text as='p' size='s' view='secondary' className='mb-2'>
						Тема
					</Text>
					<TextField
						size='m'
						placeholder='Введите тему письма'
						value={subject}
						onChange={v => setSubject(v || '')}
						className='w-full'
					/>
				</div>
				<Button
					label='Сохранить'
					view='secondary'
					disabled={!canSave || updateMutation.isPending}
					onClick={handleUpdate}
				/>
			</Layout>
		</Card>
	)
}
