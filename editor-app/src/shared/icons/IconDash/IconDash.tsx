import type { IconComponent } from '@consta/icons/Icon'

export const IconDash: IconComponent = ({ size = 's', className }) => {
	const px = { xs: 12, s: 16, m: 20, l: 24 }[size] ?? 16

	return (
		<svg
			width={px}
			height={px}
			viewBox='0 0 16 16'
			className={className}
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden
			focusable='false'
		>
			<line
				x1='2'
				y1='8'
				x2='14'
				y2='8'
				stroke='currentColor'
				strokeOpacity={0.6}
				strokeWidth={2}
				strokeDasharray='2 2'
			/>
		</svg>
	)
}
