import { useNavigate } from 'react-router-dom'

import { modals } from '@/shared/lib/modals'

import { CreateCampaignModal } from '../ui/CreateCampaignModal'

export function useCreateCampaignModal() {
	const navigate = useNavigate()

	const openCreateCampaignModal = () => {
		modals.openContent({
			title: 'Создать рассылку',
			content: (
				<CreateCampaignModal
					onClose={() => modals.closeTop()}
					onCreated={async campaign => {
						if (campaign.id) {
							await navigate(`/campaigns/${campaign.id}/edit`)
						} else {
							console.error('ID кампании не найден:', campaign)
						}
						modals.closeTop()
					}}
				/>
			)
		})
	}

	return { openCreateCampaignModal }
}
