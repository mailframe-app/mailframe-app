import { TemplateCardSkeleton } from '@/entities/templates'

interface TemplateGridSkeletonProps {
	count: number
}

export function TemplateGridSkeleton({ count }: TemplateGridSkeletonProps) {
	return (
		<div className='flex flex-wrap gap-4'>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className='w-[256px]'>
					<TemplateCardSkeleton />
				</div>
			))}
		</div>
	)
}
