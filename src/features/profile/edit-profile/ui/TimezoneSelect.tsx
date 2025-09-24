import { Select } from '@consta/uikit/SelectCanary'
import { useDebounce } from '@consta/uikit/useDebounce'
import { getTimeZones } from '@vvo/tzdb'
import { useMemo, useState } from 'react'

import { useTheme } from '@/features/theme'

export type Timezone = {
	label: string
	value: string
	offset: number
	searchableValue: string
}

// Helper to format offset
const formatOffset = (offset: number) => {
	const hours = Math.floor(Math.abs(offset))
	const minutes = Math.floor((Math.abs(offset) * 60) % 60)
	const sign = offset < 0 ? '-' : '+'
	return `UTC${sign}${String(hours).padStart(2, '0')}:${String(
		minutes
	).padStart(2, '0')}`
}

export const timezoneItems: Timezone[] = getTimeZones().map(tz => {
	const offsetHours = tz.currentTimeOffsetInMinutes / 60
	const canonicalCity = tz.name.split('/').pop()?.replace(/_/g, ' ') || ''

	return {
		label: `${tz.countryName} - ${canonicalCity} (${formatOffset(offsetHours)})`,
		searchableValue: `${tz.countryName} - ${tz.mainCities.join(
			', '
		)} (${formatOffset(offsetHours)}) ${tz.name}`,
		value: tz.name,
		offset: tz.currentTimeOffsetInMinutes
	}
})

const getItemLabel = (item: Timezone) => item.label
const getItemKey = (item: Timezone) => item.value

interface TimezoneSelectProps {
	value: Timezone | undefined
	onChange: (value: Timezone | null) => void
}

export const TimezoneSelect = ({ value, onChange }: TimezoneSelectProps) => {
	const [searchValue, setSearchValue] = useState('')
	const setSearchValueDebounce = useDebounce(setSearchValue, 300)
	const { theme } = useTheme()
	const filteredTimezones = useMemo(() => {
		if (!searchValue) {
			return timezoneItems
		}
		const lowercasedFilter = searchValue.toLowerCase()
		return timezoneItems.filter(option =>
			option.searchableValue.toLowerCase().includes(lowercasedFilter)
		)
	}, [searchValue])

	return (
		<Select
			items={filteredTimezones}
			getItemLabel={getItemLabel}
			getItemKey={getItemKey}
			placeholder='Выберите часовой пояс'
			onInput={setSearchValueDebounce}
			value={searchValue ? undefined : value}
			onChange={onChange}
			input
			style={
				{
					border: 'none',
					backgroundColor:
						theme === 'presetGpnDefault' ? '#F8FAFC' : 'var(--color-bg-stripe)',
					'--color-control-bg-default':
						theme === 'presetGpnDefault' ? '#F8FAFC' : 'var(--color-bg-stripe)'
				} as React.CSSProperties
			}
		/>
	)
}
