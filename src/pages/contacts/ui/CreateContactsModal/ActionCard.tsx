import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

import { useTheme } from '@/features/theme'

function ActionCard({
	onClick,
	image,
	title
}: {
	onClick: () => void
	image: string
	title: string
}) {
	const { theme } = useTheme()
	const isDark = theme !== 'presetGpnDefault'

	return (
		<Card
			verticalSpace='xl'
			horizontalSpace='m'
			className='hover:shadow-m m-2 flex h-full w-full flex-col items-center justify-center transition-all duration-150 hover:-translate-y-[2px]'
			style={{
				backgroundColor: 'var(--color-bg-secondary)'
			}}
			form='square'
			shadow={false}
			as='button'
			onClick={onClick}
		>
			<img
				src={image}
				alt={title}
				width={160}
				height={160}
				style={isDark ? { filter: 'invert(1)' } : {}}
			/>
			<Text size='l' view='primary' weight='bold' className='mb-2'>
				{title}
			</Text>
		</Card>
	)
}

export default ActionCard
