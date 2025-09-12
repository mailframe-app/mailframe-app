import { Link } from 'react-router-dom'

import { PRIVATE_ROUTES } from '../constants'

interface BaseLogoProps {
	size?: 'xs' | 'sm' | 'md' | 'lg'
	onlyIcon?: boolean
}

export function BaseLogo({ size = 'md', onlyIcon = false }: BaseLogoProps) {
	const logoSizeClasses = {
		xs: 'h-8',
		sm: 'h-10',
		md: 'h-16',
		lg: 'h-24'
	}

	const containerClasses = `select-none ml-6 ${
		onlyIcon ? 'block' : 'flex items-end gap-2'
	}`

	return (
		<Link to={PRIVATE_ROUTES.DASHBOARD}>
			<div className={containerClasses}>
				<img src='/Logo.png' alt='Логотип' className={logoSizeClasses[size]} />
			</div>
		</Link>
	)
}
