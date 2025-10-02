import { IconLightningBolt } from '@consta/icons/IconLightningBolt'
import { IconMoon } from '@consta/icons/IconMoon'
import { IconSun } from '@consta/icons/IconSun'
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup'

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

export const ThemeToggle = ({ size = 's' }: { size?: 's' | 'm' }) => {
	const { theme, setTheme } = useTheme()

	const handleChange = (item: Theme | null) => {
		if (item) {
			setTheme(item)
		}
	}

	return (
		<ChoiceGroup
			items={items}
			value={theme}
			view='primary'
			onChange={handleChange}
			getItemLabel={(item: Theme) => {
				if (item === 'presetGpnDefault') return 'Default'
				if (item === 'presetGpnDark') return 'Dark'
				if (item === 'presetGpnDisplay') return 'Display'
				return ''
			}}
			getItemIcon={(item: Theme) => getItemIcon(item)}
			onlyIcon
			name='ThemeToggle'
			size={size}
			className='w-46'
		/>
	)
}
