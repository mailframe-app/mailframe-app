import { Card } from '@consta/uikit/Card'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'

import { CircleProgress } from '@/shared/ui'

type Props = {
	title: string
	value: number
	percent: number
	color?: string
}

export const StatCard = ({ title, value, percent, color }: Props) => {
	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			shadow={false}
			className='flex h-full w-full justify-between !rounded-lg bg-[var(--color-bg-default)]'
		>
			<div className='flex flex-col justify-between'>
				<Text size='3xl' weight='bold' view='primary'>
					{value}
				</Text>
				<Text size='s' view='secondary' className='mb-auto'>
					{title}
				</Text>
			</div>
			<CircleProgress percent={percent} color={color} />
		</Card>
	)
}

export const StatCardSkeleton = () => {
	return (
		<Card className='w-full !rounded-xl p-6'>
			<div className='flex items-center justify-between'>
				<div className='flex flex-col gap-2'>
					<SkeletonBrick height={36} className='w-20' />
					<SkeletonBrick height={16} className='w-32' />
				</div>
				<SkeletonBrick height={64} width={64} className='rounded-full' />
			</div>
		</Card>
	)
}
