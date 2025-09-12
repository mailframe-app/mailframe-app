import { Card } from '@consta/uikit/Card'
import { SkeletonBrick, SkeletonText } from '@consta/uikit/Skeleton'

export function TemplateCardSkeleton() {
	return (
		<Card
			shadow={false}
			border
			className='!rounded-lg'
			style={{ backgroundColor: 'var(--color-bg-secondary)' }}
		>
			<div className='px-4 pt-4'>
				<SkeletonBrick height={256} className='rounded-md' />
			</div>
			<div
				className='rounded-b-lg p-4'
				style={{ background: 'var(--color-bg-default)' }}
			>
				<SkeletonText rows={1} className='mb-2' />
				<div className='flex justify-between'>
					<SkeletonBrick width={70} height={20} />
					<SkeletonBrick width={50} height={20} />
				</div>
			</div>
		</Card>
	)
}
