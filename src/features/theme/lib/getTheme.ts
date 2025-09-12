import {
	presetGpnDark,
	presetGpnDefault,
	presetGpnDisplay
} from '@consta/uikit/Theme'

import type { Theme } from './useTheme'

export function getTheme(theme: Theme) {
	if (theme === 'presetGpnDefault') return presetGpnDefault
	if (theme === 'presetGpnDark') return presetGpnDark
	return presetGpnDisplay
}
