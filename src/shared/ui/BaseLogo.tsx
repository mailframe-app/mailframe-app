import { Link } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'

import { PRIVATE_ROUTES } from '../constants'

interface BaseLogoProps {
	size?: 'xs' | 'sm' | 'md' | 'lg'
	onlyIcon?: boolean
	className?: string
	style?: React.CSSProperties
}

export function BaseLogo({
	size = 'md',
	onlyIcon = false,
	className,
	style
}: BaseLogoProps) {
	const logoSizeClasses = {
		xs: 'h-8',
		sm: 'h-14',
		md: 'h-16',
		lg: 'h-24'
	}

	const containerClasses = `select-none pl-4 ${
		onlyIcon ? 'block' : 'flex items-end gap-2'
	}`

	return (
		<Link to={PRIVATE_ROUTES.DASHBOARD}>
			<div className={cn(containerClasses, className)}>
				{onlyIcon ? (
					<img
						src='/favicon-64x64.png'
						alt='Логотип'
						className={logoSizeClasses[size]}
						style={style}
					/>
				) : (
					<img
						src='/Logo.png'
						alt='Логотип'
						className={logoSizeClasses[size]}
						style={style}
					/>
				)}
			</div>
		</Link>
	)
}
