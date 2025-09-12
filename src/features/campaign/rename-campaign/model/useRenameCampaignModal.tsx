import { modals } from '@/shared/lib/modals'

import { RenameCampaignModal } from '../ui/RenameCampaignModal'

import { type CampaignResponse } from '@/entities/campaigns'

export function useRenameCampaignModal() {
	const openRenameCampaignModal = (
		campaign: CampaignResponse,
		onRenamed: (newName: string) => void
	) => {
		const handleRenamed = (newName: string) => {
			onRenamed(newName)
			modals.closeTop()
		}

		modals.openContent({
			title: 'Переименовать рассылку',
			content: (
				<RenameCampaignModal
					campaignId={campaign.id}
					initialName={campaign.name}
					onClose={() => modals.closeTop()}
					onRenamed={handleRenamed}
				/>
			)
		})
	}

	return { openRenameCampaignModal }
}
