import { IconBackward } from '@consta/icons/IconBackward'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconForward } from '@consta/icons/IconForward'
import { IconKebab } from '@consta/icons/IconKebab'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useDeleteCampaignConfirm } from '@/features/campaign/delete-campaign'
import {
	EditableCampaignName,
	useRenameCampaignModal
} from '@/features/campaign/rename-campaign'

import { PRIVATE_ROUTES } from '@/shared/constants'

import { GroupSelectCard } from './ui/GroupSelectCard'
import { SmtpSelectCard } from './ui/SmtpSelectCard'
import { SubjectCard } from './ui/SubjectCard'
import { TemplateCard } from './ui/TemplateCard'
import { useCampaign, useUpdateCampaignMutation } from '@/entities/campaigns'

function CreateCampaignPage() {
	const navigate = useNavigate()
	const { campaignId = '' } =
		useParams<'/campaigns/:campaignId/edit'>() as unknown as {
			campaignId: string
		}

	const { data: campaign, isLoading, isError } = useCampaign(campaignId)
	const updateCampaignMutation = useUpdateCampaignMutation()

	const { openDeleteConfirm } = useDeleteCampaignConfirm({
		onSuccess: () => navigate(PRIVATE_ROUTES.CAMPANIES)
	})
	const { openRenameCampaignModal } = useRenameCampaignModal()

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuAnchorRef = useRef<HTMLButtonElement>(null)

	const [campaignName, setCampaignName] = useState('')

	// Обновляем состояние формы когда загружаются данные кампании
	useEffect(() => {
		if (campaign) {
			setCampaignName(campaign.name)
		}
	}, [campaign])

	// Проверка готовности к следующему шагу
	const isReadyForNext =
		campaign?.smtpSettingsId &&
		campaign?.contactGroupId &&
		campaign?.templateId &&
		campaign?.subject

	// Функция запуска рассылки
	const handleStartCampaign = () => {
		if (!campaign || !isReadyForNext) return
		navigate(
			PRIVATE_ROUTES.CAMPAIGN_SCHEDULE.replace(':campaignId', campaign.id)
		)
	}

	if (isLoading) {
		return (
			<Layout direction='column' className='w-full'>
				<div className='flex items-center justify-center py-20'>
					<Text size='l' view='secondary'>
						Загрузка рассылки...
					</Text>
				</div>
			</Layout>
		)
	}

	if (isError || !campaign) {
		navigate(PRIVATE_ROUTES.CAMPANIES, { replace: true })
		return null
	}

	const menuItems = [
		{
			label: 'Переименовать',
			leftIcon: IconEdit,
			onClick: () => {
				openRenameCampaignModal(campaign, newName => {
					setCampaignName(newName)
				})
				setIsMenuOpen(false)
			}
		},
		{
			label: 'Удалить',
			leftIcon: IconTrash,
			status: 'alert' as const,
			onClick: () => {
				openDeleteConfirm(campaign)
				setIsMenuOpen(false)
			}
		}
	]

	return (
		<Layout direction='column' className='w-full'>
			<div className='mb-7 flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Button
						view='clear'
						label='Назад'
						onlyIcon
						iconLeft={IconBackward}
						onClick={() => navigate(PRIVATE_ROUTES.CAMPANIES)}
						className='cursor-pointer !border !border-[var(--color-control-bg-ghost)]'
					/>
					<EditableCampaignName
						campaignId={campaign.id}
						updatedAt={campaign.updatedAt}
						initialName={campaignName}
						onNameUpdate={setCampaignName}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						ref={menuAnchorRef}
						view='clear'
						onlyIcon
						iconLeft={IconKebab}
						onClick={() => {
							setIsMenuOpen(!isMenuOpen)
						}}
						className='!hidden cursor-pointer !border !border-[var(--color-control-bg-ghost)] sm:!inline-flex'
					/>
					<Button
						view='primary'
						label='Далее'
						className='!hidden w-[132px] sm:!block'
						disabled={!isReadyForNext || updateCampaignMutation.isPending}
						onClick={handleStartCampaign}
					/>
					<Button
						view='clear'
						onlyIcon
						iconLeft={IconForward}
						onClick={handleStartCampaign}
						disabled={!isReadyForNext || updateCampaignMutation.isPending}
						className='!inline-flex cursor-pointer !border !border-[var(--color-control-bg-ghost)] sm:!hidden'
					/>
				</div>
			</div>

			<ContextMenu
				isOpen={isMenuOpen}
				items={menuItems}
				anchorRef={menuAnchorRef as any}
				onClickOutside={() => setIsMenuOpen(false)}
				offset='xs'
				direction='downStartRight'
			/>

			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-6 xl:flex-row'>
					<SmtpSelectCard campaign={campaign} />
					<GroupSelectCard campaign={campaign} />
				</div>
				<div className='flex flex-col gap-6 xl:flex-row'>
					<SubjectCard campaign={campaign} />
					<TemplateCard campaign={campaign} />
				</div>
			</div>
		</Layout>
	)
}

export const Component = CreateCampaignPage
