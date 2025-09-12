import { IconBackward } from '@consta/icons/IconBackward'
import { IconCancel } from '@consta/icons/IconCancel'
import { IconCopy } from '@consta/icons/IconCopy'
import { IconRevert } from '@consta/icons/IconRevert'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { Layout } from '@consta/uikit/Layout'
import { Tabs } from '@consta/uikit/Tabs'
import { Text } from '@consta/uikit/Text'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants'

import { CampaignAnalyticsTab } from './ui/CampaignAnalyticsTab'
import { CampaignRecipientsTab } from './ui/CampaignRecipientsTab'
import {
	StatusBadge,
	type UIStatus,
	mapCampaignStatus,
	useCampaign
} from '@/entities/campaigns'

const TABS = [
	{ id: 'analytics', label: 'Статистика' },
	{ id: 'recipients', label: 'Получатели' }
]

function OverviewCampaignPage() {
	const navigate = useNavigate()
	const { campaignId = '' } = useParams<'campaignId'>()
	const { data: campaign, isError } = useCampaign(campaignId)
	const [searchParams, setSearchParams] = useSearchParams()

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuAnchorRef = useRef<HTMLButtonElement>(null)

	const activeTabId = searchParams.get('tab') || TABS[0].id
	const activeTab = useMemo(
		() => TABS.find(tab => tab.id === activeTabId) || TABS[0],
		[activeTabId]
	)

	const handleTabChange = (tab: { id: string }) => {
		setSearchParams({ tab: tab.id })
	}

	const getMenuItems = (status: UIStatus) => {
		switch (status) {
			case 'В очереди':
			case 'Отправляется':
				return [
					{
						label: 'Отменить',
						leftIcon: IconCancel,
						status: 'alert' as const,
						onClick: () => handleAction('Отменить')
					}
				]

			case 'Запланирована':
				return [
					{
						label: 'Копировать',
						leftIcon: IconCopy,
						onClick: () => handleAction('Копировать')
					},
					{
						label: 'Отменить',
						leftIcon: IconCancel,
						status: 'alert' as const,
						onClick: () => handleAction('Отменить')
					}
				]

			case 'Отправлена':
				return [
					{
						label: 'Копировать',
						leftIcon: IconCopy,
						onClick: () => handleAction('Копировать')
					},
					{
						label: 'Повторная отправка неудачных писем',
						leftIcon: IconRevert,
						onClick: () => handleAction('Повторная отправка неудачных писем')
					}
				]

			case 'Отменена':
				return [
					{
						label: 'Копировать',
						leftIcon: IconCopy,
						onClick: () => handleAction('Копировать')
					},
					{
						label: 'Восстановить',
						leftIcon: IconRevert,
						onClick: () => handleAction('Восстановить')
					},
					{
						label: 'Удалить',
						leftIcon: IconTrash,
						status: 'alert' as const,
						onClick: () => handleAction('Удалить')
					}
				]

			case 'Черновик':
			default:
				return []
		}
	}

	const handleAction = (action: string) => {
		console.log(`Действие: ${action}`) // Заглушка
		setIsMenuOpen(false)
	}

	useEffect(() => {
		if (isError) {
			navigate(PRIVATE_ROUTES.CAMPANIES, { replace: true })
		}
	}, [isError, navigate])

	if (!campaign) return null

	const uiStatus = mapCampaignStatus(campaign.status)

	return (
		<Layout direction='column' className='w-full'>
			<div className='mb-8 flex items-center justify-between gap-2'>
				<div className='flex min-w-0 items-center gap-4'>
					<Button
						onlyIcon
						view='ghost'
						iconLeft={IconBackward}
						onClick={() => navigate(PRIVATE_ROUTES.CAMPANIES)}
						className='cursor-pointer'
					/>
					<div className='flex min-w-0 items-center gap-4'>
						<Text
							size='3xl'
							weight='bold'
							as='h1'
							view='primary'
							className='truncate'
							title={campaign.name}
						>
							{campaign.name}
						</Text>
						<StatusBadge statusText={uiStatus} />
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						ref={menuAnchorRef}
						label='Действия'
						onClick={() => setIsMenuOpen(true)}
					/>
				</div>
			</div>

			<ContextMenu
				isOpen={isMenuOpen}
				items={getMenuItems(uiStatus)}
				anchorRef={menuAnchorRef as any}
				onClickOutside={() => setIsMenuOpen(false)}
				offset='xs'
				direction='downStartRight'
			/>

			<Tabs
				view='clear'
				value={activeTab}
				onChange={handleTabChange}
				items={TABS}
				getItemLabel={item => item.label}
				className='custom-tab'
			/>
			<div className='mt-6'>
				{activeTab.id === 'analytics' && (
					<CampaignAnalyticsTab campaignId={campaign.id} />
				)}
				{activeTab.id === 'recipients' && (
					<CampaignRecipientsTab campaignId={campaign.id} />
				)}
			</div>
		</Layout>
	)
}

export const Component = OverviewCampaignPage
