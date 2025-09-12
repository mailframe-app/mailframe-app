import type { IconComponent } from '@consta/icons/Icon'

export const IconLine: IconComponent = ({ size = 's', className }) => {
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
			<path
				d='M8 16L5 11.6923H7V10V6V4.30769H5L8 0L11 4.30769H9V6H7V10H9V11.6923H11L8 16Z'
				fill='currentColor'
			/>
			<path d='M2 7H14V9H2V7Z' fill='currentColor' fillOpacity={0.8} />
		</svg>
	)
}
