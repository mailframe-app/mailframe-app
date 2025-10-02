import type { IconComponent } from '@consta/icons/Icon'

export const ArrowMenuClose: IconComponent = ({ size = 's', className }) => {
	const px = { xs: 12, s: 16, m: 20, l: 24 }[size] ?? 16

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={px}
			height={px}
			viewBox='0 0 24 24'
			className={className}
			aria-hidden
			focusable='false'
		>
			<path fill='currentColor' d='M11 17V7l-5 5zm2 4h2V3h-2z' />
		</svg>
	)
}

export const ArrowMenuOpen: IconComponent = ({ size = 's', className }) => {
	const px = { xs: 12, s: 16, m: 20, l: 24 }[size] ?? 16

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={px}
			height={px}
			viewBox='0 0 24 24'
			className={className}
			aria-hidden
			focusable='false'
		>
			<path fill='currentColor' d='M9 21V3h2v18zm4-4V7l5 5z' />
		</svg>
	)
}
