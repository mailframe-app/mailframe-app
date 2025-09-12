import { CampaignCardSkeleton } from '@/entities/campaigns'

interface CampaignGridSkeletonProps {
	count: number
}

export function CampaignGridSkeleton({ count }: CampaignGridSkeletonProps) {
	return (
		<div className='flex flex-col'>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index}>
					<CampaignCardSkeleton />
				</div>
			))}
		</div>
	)
}
