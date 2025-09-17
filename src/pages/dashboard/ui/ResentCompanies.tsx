import { IconTopRight } from '@consta/icons/IconTopRight'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { ResponsesNothingFound } from '@consta/uikit/ResponsesNothingFound'
import { Text } from '@consta/uikit/Text'
import { Link, useNavigate } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants'

import styles from './ResentCompanies.module.css'
import type { CampaignListItem } from '@/entities/campaigns'
import {
	CampaignCard,
	CampaignCardSkeleton,
	useCampaigns
} from '@/entities/campaigns'

export const ResentCompanies = () => {
	const navigate = useNavigate()
	const { data, isLoading, isError, error } = useCampaigns({
		limit: 3,
		sortBy: 'updatedAt',
		sortOrder: 'desc'
	})

	const renderCampaigns = () => {
		if (isLoading) {
			return (
				<Layout direction='column'>
					{Array.from({ length: 3 }, (_, index) => (
						<CampaignCardSkeleton key={index} variant='short' />
					))}
				</Layout>
			)
		}

		if (isError) {
			return (
				<Card verticalSpace='m' horizontalSpace='m'>
					<div className={styles.smallResponse}>
						<ResponsesNothingFound
							title='Ошибка загрузки'
							description={
								error?.message || 'Не удалось загрузить данные о рассылках'
							}
						/>
					</div>
				</Card>
			)
		}

		if (!data?.items || data.items.length === 0) {
			return (
				<Card verticalSpace='m' horizontalSpace='m'>
					<div className={styles.smallResponse}>
						<ResponsesNothingFound
							title='Ничего не найдено'
							size='m'
							description='Создайте рассылку и отслеживайте результаты. Нажмите «Добавить рассылку» и начинайте!'
							actions={
								<Button
									label='Добавить рассылку'
									view='primary'
									onClick={() => navigate(PRIVATE_ROUTES.CAMPANIES)}
								/>
							}
						/>
					</div>
				</Card>
			)
		}

		return (
			<Layout direction='column' className='gap-4'>
				{data.items.map((campaign: CampaignListItem) => (
					<CampaignCard key={campaign.id} campaign={campaign} variant='short' />
				))}
			</Layout>
		)
	}
	return (
		<Card
			className='flex-1 !rounded-lg bg-[var(--color-bg-default)]'
			verticalSpace='l'
			horizontalSpace='l'
		>
			<div className='mb-5 flex items-center justify-between'>
				<Text as='h2' view='primary' size='xl' weight='semibold'>
					Рассылки
				</Text>
				<Link to={PRIVATE_ROUTES.CAMPANIES}>
					<Button label='Смотреть все' view='clear' iconRight={IconTopRight} />
				</Link>
			</div>
			<div className='overflow-x-auto'>
				<div className='inline-block min-w-full align-middle'>
					<div className='overflow-visible p-0.5'>{renderCampaigns()}</div>
				</div>
			</div>
		</Card>
	)
}
