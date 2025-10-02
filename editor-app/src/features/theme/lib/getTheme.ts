import { presetGpnDark, presetGpnDefault, presetGpnDisplay } from '@consta/uikit/Theme'

import type { Theme } from '../model/theme.store'

export function getTheme(theme: Theme) {
	if (theme === 'presetGpnDefault') return presetGpnDefault
	if (theme === 'presetGpnDark') return presetGpnDark
	return presetGpnDisplay
}
