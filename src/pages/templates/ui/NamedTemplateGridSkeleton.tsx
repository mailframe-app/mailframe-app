import { NamedTemplateCardSkeleton } from '@/entities/templates'

interface NamedTemplateGridSkeletonProps {
	count: number
}

export function NamedTemplateGridSkeleton({
	count
}: NamedTemplateGridSkeletonProps) {
	return (
		<div className='flex flex-wrap gap-4'>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className='w-[256px]'>
					<NamedTemplateCardSkeleton />
				</div>
			))}
		</div>
	)
}
