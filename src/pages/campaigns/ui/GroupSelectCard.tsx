import { useMemo } from 'react'

import { PRIVATE_ROUTES } from '@/shared/constants'

import { SelectCard, type SelectItem } from './SelectCard'
import {
	type CampaignResponse,
	useUpdateCampaignMutation
} from '@/entities/campaigns'
import { useGroups } from '@/entities/contacts'

type GroupSelectCardProps = {
	campaign: CampaignResponse
}

export function GroupSelectCard({ campaign }: GroupSelectCardProps) {
	const { data: groups, isLoading: groupsLoading } = useGroups()
	const updateCampaignMutation = useUpdateCampaignMutation()

	const items = useMemo(
		() =>
			(groups?.items || []).map((g: any) => ({
				id: g.id,
				label: g.name
			})),
		[groups]
	)

	const value = useMemo(
		() => items.find(item => item.id === campaign.contactGroupId) || null,
		[items, campaign.contactGroupId]
	)

	const handleSelect = (item: SelectItem | null) => {
		if (campaign && item) {
			updateCampaignMutation.mutate({
				id: campaign.id,
				payload: { contactGroupId: item.id }
			})
		}
	}

	return (
		<SelectCard
			title='Получатели'
			description='Кому отправляем рассылку?'
			selectLabel='Группа получателей'
			selectPlaceholder='Выберите группу'
			items={items}
			value={value}
			onSelect={handleSelect}
			isLoading={groupsLoading}
			stepNumber={2}
			selectHelpText='Для выбора необходимо'
			linkText='создать группу'
			linkUrl={PRIVATE_ROUTES.CONTACTS + '?tab=groups'}
			withSearch
		/>
	)
}
