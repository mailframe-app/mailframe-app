import React from 'react'

import { type PanelButtonProps } from '../model/types'

export const PanelButton = React.forwardRef<HTMLButtonElement, PanelButtonProps>(
	({ children, className = '', disabled, ...rest }, ref) => (
		<button
			ref={ref}
			disabled={disabled}
			aria-disabled={disabled || undefined}
			{...rest}
			className={[
				'flex h-8 w-8 items-center justify-center rounded border-none bg-transparent text-white transition-colors duration-200 ease-in-out',
				disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-600',
				className
			].join(' ')}
		>
			{children}
		</button>
	)
)

PanelButton.displayName = 'PanelButton'
