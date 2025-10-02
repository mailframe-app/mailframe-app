import { IconBackward } from '@consta/icons/IconBackward'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconKebab } from '@consta/icons/IconKebab'
import { IconSendMessage } from '@consta/icons/IconSendMessage'
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
import { formatDate, showCustomToast } from '@/shared/lib'

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
					description: `Рассылка "${campaign.name}" поставлена в очередь на отправку`,
					title: `Успешно`,
					type: 'success'
				})
			} else {
				// Проверяем, выбрано ли время
				if (!datetime) {
					showCustomToast({
						title: 'Ошибка',
						description: 'Выберите дату и время отправки',
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
					description: `Рассылка "${campaign.name}" запланирована`,
					title: `Успешно`,
					type: 'success'
				})
			}

			// Переходим на страницу рассылок
			navigate(PRIVATE_ROUTES.CAMPANIES)
		} catch (error) {
			showCustomToast({
				title: 'Ошибка',
				description: 'Произошла ошибка при отправке рассылки',
				type: 'error'
			})
			console.error('Ошибка отправки рассылки:', error)
		}
	}

	return (
		<Layout direction='column' className='w-full'>
			<div className='mb-7 flex items-center justify-between gap-2'>
				<div className='flex items-center gap-4'>
					<Button
						view='clear'
						onlyIcon
						iconLeft={IconBackward}
						onClick={handleGoBack}
						className='cursor-pointer !border !border-[var(--color-control-bg-ghost)]'
					/>
					<div className='flex flex-col'>
						<div className='flex items-center gap-2'>
							<Text
								as='h1'
								view='primary'
								size='xl'
								weight='semibold'
								className='leading-6'
							>
								{campaign.name}
							</Text>
						</div>
						<Text
							as='p'
							view='secondary'
							size='s'
							className='!hidden sm:!block'
						>
							Обновлено: {formatDate(campaign.updatedAt)}
						</Text>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						ref={menuAnchorRef}
						view='clear'
						onlyIcon
						iconLeft={IconKebab}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className='!hidden cursor-pointer !border !border-[var(--color-control-bg-ghost)] sm:!inline-flex'
					/>
					<Button
						view='primary'
						label={sendOption === 'now' ? 'Отправить сейчас' : 'Запланировать'}
						className='!hidden w-[200px] sm:!block'
						onClick={handleSend}
						loading={isSubmitting}
						disabled={sendOption === 'scheduled' && !datetime}
					/>
					<Button
						view='primary'
						onlyIcon
						iconLeft={IconSendMessage}
						onClick={handleSend}
						loading={isSubmitting}
						disabled={sendOption === 'scheduled' && !datetime}
						className='!inline-flex sm:!hidden'
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

			<Layout direction='column' className='flex flex-col gap-6'>
				<Card
					className='flex-1 !rounded-lg !bg-[var(--color-bg-default)]'
					verticalSpace='l'
					horizontalSpace='l'
					shadow={false}
				>
					<Text as='h2' view='primary' size='xl' weight='semibold'>
						Отправка рассылки
					</Text>
					<SendingCard
						campaignId={campaign.id}
						sendOption={sendOption}
						datetime={datetime}
						onSendOptionChange={handleSendOptionChange}
						onDatetimeChange={setDatetime}
					/>
				</Card>

				<Card
					className='flex-1 !rounded-lg !bg-[var(--color-bg-default)]'
					verticalSpace='l'
					horizontalSpace='l'
					shadow={false}
				>
					<Text as='h2' view='primary' size='xl' weight='semibold'>
						Проверка данных
					</Text>
					<InfoCard campaign={campaign} />
				</Card>

				{templatePreview?.variableMapping &&
					Object.keys(templatePreview.variableMapping).length > 0 && (
						<Card
							className='flex-1 !rounded-lg !bg-[var(--color-bg-default)]'
							verticalSpace='l'
							horizontalSpace='l'
							shadow={false}
						>
							<Text as='h2' view='primary' size='xl' weight='semibold'>
								Переменные в шаблоне
							</Text>
							<VariableMappingCard mapping={templatePreview.variableMapping} />
						</Card>
					)}

				{templatePreview?.previewUrl && (
					<Card
						className='flex-1 !rounded-lg !bg-[var(--color-bg-default)]'
						verticalSpace='l'
						horizontalSpace='l'
						shadow={false}
					>
						<Text
							as='h2'
							view='primary'
							size='xl'
							weight='semibold'
							className='mb-4'
						>
							Содержание письма
						</Text>
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
				)}
			</Layout>
		</Layout>
	)
}

export const Component = ScheduleCampaignPage
