import { CampaignCardWithMenu } from './CampaignCardWithMenu'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CampaignGridProps {
	campaigns: any[]
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
	return (
		<div className='flex flex-col'>
			{campaigns.map(campaign => (
				<div key={campaign.id}>
					<CampaignCardWithMenu campaign={campaign} />
				</div>
			))}
		</div>
	)
}
