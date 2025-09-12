import React from 'react'

import { type PanelButtonProps } from '../model/types'

export const PanelButton = React.forwardRef<HTMLButtonElement, PanelButtonProps>(
	({ children, ...props }, ref) => (
		<button
			ref={ref}
			{...props}
			className='flex h-8 w-8 cursor-pointer items-center justify-center rounded border-none bg-transparent text-white transition-colors duration-200 ease-in-out hover:bg-blue-600'
		>
			{children}
		</button>
	)
)

PanelButton.displayName = 'PanelButton'
