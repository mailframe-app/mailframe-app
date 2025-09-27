import { IconLightningBolt } from '@consta/icons/IconLightningBolt'
import { IconMoon } from '@consta/icons/IconMoon'
import { IconSun } from '@consta/icons/IconSun'
import { ThemeToggler } from '@consta/uikit/ThemeToggler'

import type { Theme } from '../lib/useTheme'
import { useTheme } from '../lib/useTheme'

const items: Theme[] = ['presetGpnDefault', 'presetGpnDark', 'presetGpnDisplay']

const getItemIcon = (item: Theme) => {
	if (item === 'presetGpnDefault') {
		return IconSun
	}
	if (item === 'presetGpnDark') {
		return IconMoon
	}
	if (item === 'presetGpnDisplay') {
		return IconLightningBolt
	}
	return IconSun
}

export const MobileThemeToggle = ({ size = 's' }: { size?: 's' | 'm' }) => {
	const { theme, setTheme } = useTheme()

	const handleChange = (item: Theme | null) => {
		if (item) {
			setTheme(item)
		}
	}

	return (
		<ThemeToggler
			items={items}
			value={theme}
			view='clear'
			onChange={handleChange}
			getItemLabel={(item: Theme) => {
				if (item === 'presetGpnDefault') return 'Default'
				if (item === 'presetGpnDark') return 'Dark'
				if (item === 'presetGpnDisplay') return 'Display'
				return ''
			}}
			getItemIcon={(item: Theme) => getItemIcon(item)}
			size={size}
			direction='downStartRight'
			getItemKey={(item: Theme) => item}
		/>
	)
}
