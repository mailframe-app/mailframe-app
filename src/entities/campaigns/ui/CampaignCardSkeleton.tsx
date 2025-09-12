import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import {
	SkeletonBrick,
	SkeletonCircle,
	SkeletonText
} from '@consta/uikit/Skeleton'

export function CampaignCardSkeleton({
	variant = 'long'
}: {
	variant?: 'short' | 'long'
}) {
	return (
		<Card
			verticalSpace='m'
			horizontalSpace='m'
			className={`campaign-card ${variant === 'short' ? 'campaign-card--short' : ''}`}
		>
			<Layout>
				<Layout direction='column' className='campaign-card__info'>
					<SkeletonBrick width={100} height={20} className='mb-2' />
					<SkeletonText rows={2} />
				</Layout>

				<Layout className='campaign-card__stat'>
					<SkeletonCircle size={64} />
					<div className='flex flex-col'>
						<SkeletonBrick width={60} height={16} className='mb-1' />
						<SkeletonBrick width={20} height={16} />
					</div>
				</Layout>
				<Layout className='campaign-card__stat'>
					<SkeletonCircle size={64} />
					<div className='flex flex-col'>
						<SkeletonBrick width={60} height={16} className='mb-1' />
						<SkeletonBrick width={20} height={16} />
					</div>
				</Layout>
				{variant === 'long' && (
					<Layout className='campaign-card__right-side'>
						<div className='flex flex-col'>
							<SkeletonBrick width={80} height={16} className='mb-1' />
							<SkeletonBrick width={100} height={16} />
						</div>
						<SkeletonBrick width={40} height={40} />
					</Layout>
				)}
			</Layout>
		</Card>
	)
}
