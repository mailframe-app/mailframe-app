import type { IconComponent } from '@consta/icons/Icon'
import type { ComponentType, ReactElement } from 'react'

export interface ComponentConfig {
	icon: IconComponent
	title: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: ComponentType<any> | ReactElement
	componentProps?: Record<string, unknown>
	isCanvas?: boolean
}

export interface ComponentItemProps {
	icon: IconComponent
	title: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component?: ComponentType<any> | ReactElement
	componentProps?: Record<string, unknown>
	isCanvas?: boolean
	onClick?: () => void
}

export interface ComponentGridProps {
	components: ComponentConfig[]
}
