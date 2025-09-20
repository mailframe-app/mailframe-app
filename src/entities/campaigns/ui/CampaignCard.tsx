import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'

import { formatDate } from '@/shared/lib'
import { CircleProgress } from '@/shared/ui'

import { mapCampaignStatus } from '../lib/status'

import './CampaignCard.css'
import { StatusBadge } from './StatusBadge'
import { type CampaignListItem } from '@/entities/campaigns'

interface CampaignCardProps {
	campaign: CampaignListItem
	variant?: 'long' | 'short'
	actions?: React.ReactNode
}

export function CampaignCard({
	campaign,
	variant = 'long',
	actions
}: CampaignCardProps) {
	const uiStatus = mapCampaignStatus(campaign.status)

	const getDateLabel = () => {
		switch (campaign.status) {
			case 'SENT':
				return `Отправлена ${formatDate(campaign.sentAt)}`
			case 'SCHEDULED':
				return `Запланирована ${formatDate(campaign.scheduledAt)}`
			default:
				return `Создана ${formatDate(campaign.createdAt)}`
		}
	}

	return (
		<Card
			verticalSpace='m'
			horizontalSpace='m'
			className='campaign-card !border !border-[var(--color-bg-ghost)]'
			shadow={false}
		>
			<Layout>
				<Layout direction='column' className='campaign-card__info'>
					<StatusBadge statusText={uiStatus} />

					<Text
						as='h4'
						size='m'
						view='primary'
						weight='semibold'
						className='campaign-card__title'
						title={campaign.name}
					>
						{campaign.name}
					</Text>
					<Text as='span' weight='regular' view='ghost' size='xs'>
						{getDateLabel()}
					</Text>
				</Layout>

				<Layout className='campaign-card__stat'>
					<CircleProgress
						size={64}
						percent={campaign.openRate * 100}
						color='#56B9F2'
					/>
					<Layout direction='column'>
						<Text as='span' size='s' weight='regular' view='secondary'>
							Открытия
						</Text>
						<Text as='span' size='s' weight='bold' view='primary'>
							{campaign.opensCount}
						</Text>
					</Layout>
				</Layout>
				<Layout className='campaign-card__stat'>
					<CircleProgress
						size={64}
						percent={campaign.clickRate * 100}
						color='#09B37B'
					/>
					<Layout direction='column'>
						<Text as='span' size='s' weight='regular' view='secondary'>
							Переходы
						</Text>
						<Text as='span' size='s' weight='bold' view='primary'>
							{campaign.clicksCount}
						</Text>
					</Layout>
				</Layout>

				{variant === 'long' && (
					<Layout className='campaign-card__right-side'>
						<Layout direction='column'>
							<Text as='span' size='s' weight='regular' view='secondary'>
								Получатели:
							</Text>
							<Text as='span' size='s' weight='regular' view='primary'>
								{campaign.group?.name || '—'}
							</Text>
						</Layout>
						{actions}
					</Layout>
				)}
			</Layout>
		</Card>
	)
}
