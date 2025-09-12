import type { IconComponent } from '@consta/icons/Icon'

export const IconAlignBlocksMid: IconComponent = ({ size = 's', className }) => {
	const px = { xs: 12, s: 16, m: 20, l: 24 }[size] ?? 16

	return (
		<svg
			width={px}
			height={px}
			viewBox='0 0 16 17'
			className={className}
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden
			focusable='false'
		>
			<path d='M10 4.5H15V7.5H10V4.5Z' fill='currentColor' />
			<path d='M2 9.5H6V12.5H2V9.5Z' fill='currentColor' />
			<path d='M7 2.5H9V14.5H7V2.5Z' fill='currentColor' />
			<path d='M6 4.5H1V7.5H6V4.5Z' fill='currentColor' />
			<path d='M14 9.5H10V12.5H14V9.5Z' fill='currentColor' />
		</svg>
	)
}
