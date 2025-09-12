import type { IconComponent } from '@consta/icons/Icon'

import type { Align } from '@/shared/types/align'

export interface AlignOption {
	Icon: IconComponent
	value: 'left' | 'center' | 'right'
}

export type AlignOptionText = {
	Icon: IconComponent
	value: Align
	title: string
}
