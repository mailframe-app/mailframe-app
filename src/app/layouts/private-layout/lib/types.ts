import type { IconComponent } from '@consta/icons/Icon'

export interface AppNavbarItem {
	id: string
	label: string
	icon: IconComponent
	target?: string
}
