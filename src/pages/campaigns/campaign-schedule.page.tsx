import { IconBackward } from '@consta/icons/IconBackward'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconKebab } from '@consta/icons/IconKebab'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useDeleteCampaignConfirm } from '@/features/campaign/delete-campaign'
import { useRenameCampaignModal } from '@/features/campaign/rename-campaign'

import { PRIVATE_ROUTES } from '@/shared/constants'
import { showCustomToast } from '@/shared/lib'

import { InfoCard } from './ui/InfoCard'
import { SendingCard } from './ui/SendingCard'
import { VariableMappingCard } from './ui/VariableMappingCard'
import {
	useCampaign,
	useScheduleCampaignMutation,
	useStartCampaignMutation
} from '@/entities/campaigns'
import { useTemplatePreview } from '@/entities/templates'

function ScheduleCampaignPage() {
	const navigate = useNavigate()
	const { campaignId = '' } = useParams<'campaignId'>()
	const { data: campaign, isLoading, isError } = useCampaign(campaignId)
	const { data: templatePreview } = useTemplatePreview(
		campaign?.templateId,
		!!campaign?.templateId
	)

	// Состояние для SendingCard
	const [sendOption, setSendOption] = useState<'now' | 'scheduled'>('now')
	const [datetime, setDatetime] = useState<Date | null>(null)

	const handleSendOptionChange = (option: 'now' | 'scheduled') => {
		setSendOption(option)
		if (option === 'scheduled' && !datetime) {
			const now = new Date()
			const nextHour = new Date(now)
			nextHour.setHours(now.getHours() + 1, 0, 0, 0)
			setDatetime(nextHour)
		}
	}

	// Мутации для отправки рассылки
	const startCampaignMutation = useStartCampaignMutation()
	const scheduleCampaignMutation = useScheduleCampaignMutation()

	// Состояние загрузки для кнопки отправки
	const isSubmitting =
		startCampaignMutation.isPending || scheduleCampaignMutation.isPending

	const { openDeleteConfirm } = useDeleteCampaignConfirm({
		onSuccess: () => navigate(PRIVATE_ROUTES.CAMPANIES)
	})
	const { openRenameCampaignModal } = useRenameCampaignModal()

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuAnchorRef = useRef<HTMLButtonElement>(null)

	if (isLoading) {
		return <Text>Загрузка...</Text>
	}

	if (isError || !campaign) {
		return <Text>Ошибка загрузки кампании.</Text>
	}

	const menuItems = [
		{
			label: 'Переименовать',
			leftIcon: IconEdit,
			onClick: () => {
				openRenameCampaignModal(campaign, () => {})
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

	const handleGoBack = () => {
		navigate(PRIVATE_ROUTES.CAMPAIGN_EDIT.replace(':campaignId', campaign.id))
	}

	const handleSend = async () => {
		try {
			if (sendOption === 'now') {
				// Отправляем сейчас
				await startCampaignMutation.mutateAsync({ id: campaign.id })
				showCustomToast({
					title: `Рассылка "${campaign.name}" поставлена в очередь на отправку`,
					type: 'success'
				})
			} else {
				// Проверяем, выбрано ли время
				if (!datetime) {
					showCustomToast({
						title: 'Выберите дату и время отправки',
						type: 'error'
					})
					return
				}

				// Запланировать отправку
				await scheduleCampaignMutation.mutateAsync({
					id: campaign.id,
					payload: {
						scheduledAt: datetime.toISOString()
					}
				})

				showCustomToast({
					title: `Рассылка "${campaign.name}" запланирована`,
					type: 'success'
				})
			}

			// Переходим на страницу рассылок
			navigate(PRIVATE_ROUTES.CAMPANIES)
		} catch (error) {
			showCustomToast({
				title: 'Произошла ошибка при отправке рассылки',
				type: 'error'
			})
			console.error('Ошибка отправки рассылки:', error)
		}
	}

	return (
		<Layout direction='column' className='w-full'>
			<div className='flex items-center justify-between gap-2 py-3'>
				<div className='flex items-center gap-4'>
					<Button
						onlyIcon
						view='ghost'
						iconLeft={IconBackward}
						onClick={handleGoBack}
						className='cursor-pointer'
					/>
					<Text
						size='3xl'
						weight='bold'
						as='h1'
						view='primary'
						className='overflow-hidden text-ellipsis whitespace-nowrap'
					>
						{campaign.name}
					</Text>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						ref={menuAnchorRef}
						view='ghost'
						iconLeft={IconKebab}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>
					<Button
						view='primary'
						label={sendOption === 'now' ? 'Отправить сейчас' : 'Запланировать'}
						className='w-[200px]'
						onClick={handleSend}
						loading={isSubmitting}
						disabled={sendOption === 'scheduled' && !datetime}
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

			<Layout direction='column' className='flex flex-col gap-8 pt-8'>
				<Layout direction='column'>
					<Text as='h3' view='primary' size='xl' weight='bold' className='mb-8'>
						Отправка рассылки
					</Text>
					<SendingCard
						campaignId={campaign.id}
						sendOption={sendOption}
						datetime={datetime}
						onSendOptionChange={handleSendOptionChange}
						onDatetimeChange={setDatetime}
					/>
				</Layout>

				<Layout direction='column'>
					<Text as='h3' view='primary' size='xl' weight='bold' className='mb-8'>
						Проверка данных
					</Text>
					<InfoCard campaign={campaign} />
				</Layout>

				{templatePreview?.variableMapping &&
					Object.keys(templatePreview.variableMapping).length > 0 && (
						<Layout direction='column'>
							<Text
								as='h3'
								view='primary'
								size='xl'
								weight='bold'
								className='mb-8'
							>
								Переменные в шаблоне
							</Text>
							<VariableMappingCard mapping={templatePreview.variableMapping} />
						</Layout>
					)}

				{templatePreview?.previewUrl && (
					<Layout direction='column' className='mb-8'>
						<Text
							as='h3'
							view='primary'
							size='xl'
							weight='bold'
							className='mb-8'
						>
							Содержание письма
						</Text>
						<Card verticalSpace='m' horizontalSpace='m' className='!rounded-lg'>
							<img
								src={templatePreview.previewUrl}
								alt='Выбранный шаблон'
								className='mx-auto max-w-full rounded-lg object-contain'
								style={{
									boxShadow:
										'0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
								}}
							/>
						</Card>
					</Layout>
				)}
			</Layout>
		</Layout>
	)
}

export const Component = ScheduleCampaignPage
