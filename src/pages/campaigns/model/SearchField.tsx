import { TextField } from '@consta/uikit/TextField'
import { useDebounce } from '@consta/uikit/useDebounce'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useTheme } from '@/features/theme'
import { IconSearchStroked } from '@consta/icons/IconSearchStroked'

export function SearchField() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [value, setValue] = useState(searchParams.get('search') || '')
	const { theme } = useTheme()
	const handleSearchChange = (newValue: string) => {
		const newParams = new URLSearchParams(searchParams)
		if (newValue) {
			newParams.set('search', newValue)
		} else {
			newParams.delete('search')
		}
		setSearchParams(newParams, { replace: true })
	}

	const debouncedOnSearchChange = useDebounce(handleSearchChange, 400)

	useEffect(() => {
		debouncedOnSearchChange(value)
	}, [value, debouncedOnSearchChange])

	useEffect(() => {
		const searchFromUrl = searchParams.get('search') || ''
		if (searchFromUrl !== value) {
			setValue(searchFromUrl)
		}
	}, [searchParams])

	return (
		<TextField
			value={value}
			size='m'
			leftSide={IconSearchStroked}
			onChange={val => setValue(val || '')}
			placeholder='Поиск по названию'
			className='custom-clear-icon textfield-no-border w-full'
			withClearButton
			style={
				{
					'--color-control-bg-default':
						theme === 'presetGpnDefault' ? '#F8FAFC' : 'var(--color-bg-stripe)'
				} as React.CSSProperties
			}
		/>
	)
}
