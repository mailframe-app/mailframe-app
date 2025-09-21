import { useTheme } from '@/features/theme'

interface CircleProgressProps {
	percent: number
	color?: string
	size?: number
	strokeWidth?: number
}

export const CircleProgress = ({
	percent = 50,
	color = '#4CAF50',
	size = 64,
	strokeWidth = 5
}: CircleProgressProps) => {
	const theme = useTheme()
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const offset = circumference * (1 - percent / 100)

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill='none'
				stroke='#ECF1F4'
				strokeWidth={strokeWidth}
			/>

			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill='none'
				stroke={color}
				strokeWidth={strokeWidth}
				strokeLinecap='round'
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				transform={`rotate(90 ${size / 2} ${size / 2})`}
			/>

			<text
				x='50%'
				y='50%'
				textAnchor='middle'
				dy='.3em'
				fontFamily='Inter'
				fontSize='14'
				fontWeight='600'
				fill={theme.theme !== 'presetGpnDefault' ? '#ffffff' : '#000'}
			>
				{Math.round(percent)}%
			</text>
		</svg>
	)
}
