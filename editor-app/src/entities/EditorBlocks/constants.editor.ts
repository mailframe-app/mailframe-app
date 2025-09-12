import type { IconComponent } from '@consta/icons/Icon'
import { IconAlignBlocksLeft } from '@consta/icons/IconAlignBlocksLeft'
import { IconAlignBlocksRight } from '@consta/icons/IconAlignBlocksRight'
import { IconAlignCenter } from '@consta/icons/IconAlignCenter'
import { IconAlignLeft } from '@consta/icons/IconAlignLeft'
import { IconAlignRight } from '@consta/icons/IconAlignRight'
import { IconRemove } from '@consta/icons/IconRemove'

import { IconAlignBlocksMid, IconDash, IconDots } from '@/shared/icons'
import type { AlignOption } from '@/shared/ui'
import type { AlignOptionText } from '@/shared/ui/AlignButtons/alignOptions.types'

export const ALIGN_OPTIONS: AlignOption[] = [
	{ Icon: IconAlignBlocksLeft as IconComponent, value: 'left' },
	{ Icon: IconAlignBlocksMid as IconComponent, value: 'center' },
	{ Icon: IconAlignBlocksRight as IconComponent, value: 'right' }
]

export const ALIGN_OPTIONS_TEXT: AlignOptionText[] = [
	{ Icon: IconAlignLeft, value: 'left', title: 'Влево' },
	{ Icon: IconAlignCenter, value: 'center', title: 'По центру' },
	{ Icon: IconAlignRight, value: 'right', title: 'Вправо' }
]

export const LINE_STYLE_OPTIONS = [
	{ icon: IconRemove, value: 'solid' as const },
	{ icon: IconDash, value: 'dashed' as const },
	{ icon: IconDots, value: 'dotted' as const }
]

export const MIN_ICON_SIZE = 8
export const MAX_ICON_SIZE = 64

export const DEFAULT_SOCIAL_ICON =
	'https://steamuserimages-a.akamaihd.net/ugc/2079019457927111911/45068F1A462AF6EB757ADABDD621AB5FDE49E38E/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true'

export const DEFAULT_IMAGE =
	'https://steamuserimages-a.akamaihd.net/ugc/2079019457927111911/45068F1A462AF6EB757ADABDD621AB5FDE49E38E/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true'

export const DEFAULT_FONT_SIZE_PX = 14
export const DEFAULT_LINE_HEIGHT = 1.5
export const LINE_HEIGHT_STEP = 0.1
export const LINE_HEIGHT_MIN = 0.8
