import { CampaignCardWithMenu } from './CampaignCardWithMenu'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CampaignGridProps {
	campaigns: any[]
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
	return (
		<div className='overflow-x-auto'>
			<div className='inline-block min-w-full align-middle'>
				<div className='flex flex-col gap-y-2'>
					{campaigns.map(campaign => (
						<div key={campaign.id}>
							<CampaignCardWithMenu campaign={campaign} />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
