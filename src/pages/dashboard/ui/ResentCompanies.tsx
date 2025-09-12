import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { ResponsesNothingFound } from '@consta/uikit/ResponsesNothingFound'
import { useNavigate } from 'react-router-dom'

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
			<Layout direction='column'>
				{data.items.map((campaign: CampaignListItem) => (
					<CampaignCard key={campaign.id} campaign={campaign} variant='short' />
				))}
			</Layout>
		)
	}
	return (
		<Layout direction='column' className='w-full'>
			{renderCampaigns()}
		</Layout>
	)
}
