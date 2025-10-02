import { IconCheck } from '@consta/icons/IconCheck'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useSelectTemplateModal } from '@/features/campaign/select-template'

import { PRIVATE_ROUTES } from '@/shared/constants'

import {
	type CampaignResponse,
	useUpdateCampaignMutation
} from '@/entities/campaigns'
import { type TemplateListItem, templatesKeys } from '@/entities/templates'
import { useTemplatePreview } from '@/entities/templates/model/use-template-preview'

interface TemplateCardProps {
	campaign: CampaignResponse
}

export function TemplateCard({ campaign }: TemplateCardProps) {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { data: templatePreview, isLoading } = useTemplatePreview(
		campaign.templateId,
		!!campaign.templateId
	)
	const { mutate: updateCampaign } = useUpdateCampaignMutation()

	const handleSuccess = (template: TemplateListItem) => {
		queryClient.setQueryData(templatesKeys.preview(template.id), {
			id: template.id,
			name: template.name,
			previewUrl: template.previewUrl
		})
		updateCampaign({
			id: campaign.id,
			payload: { templateId: template.id }
		})
	}

	const openSelectTemplateModal = useSelectTemplateModal({
		campaignId: campaign.id,
		onSuccess: handleSuccess
	})

	const handleCreate = () => {
		navigate(PRIVATE_ROUTES.TEMPLATES)
	}

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
			<div className='flex items-start gap-6'>
				<div className='flex-1'>
					<div className='flex items-center justify-between'>
						<Text
							as='h3'
							size='xl'
							weight='semibold'
							className='m-0'
							view='primary'
						>
							Шаблон для рассылки
						</Text>

						{campaign.templateId ? (
							<Badge
								size='l'
								iconLeft={IconCheck}
								form='round'
								className='border-primary text-primary border bg-transparent'
							/>
						) : (
							<Badge
								size='l'
								label='4'
								form='round'
								status='system'
								className='border border-gray-300 bg-transparent text-gray-400'
							/>
						)}
					</div>

					<Text as='p' size='m' view='secondary' className='mb-16'>
						{isLoading
							? 'Загрузка названия...'
							: campaign.templateId && templatePreview?.name
								? `Выбран шаблон: ${templatePreview.name}`
								: 'Создайте с нуля или выберите готовый шаблон письма из библиотеки'}
					</Text>

					<Layout className='gap-4'>
						<Button
							size='m'
							label='Создать'
							view='secondary'
							onClick={handleCreate}
						/>
						<Button
							size='m'
							label={campaign.templateId ? 'Изменить' : 'Выбрать'}
							view='primary'
							onClick={openSelectTemplateModal}
						/>
					</Layout>
				</div>
			</div>
		</Card>
	)
}
