import { TextField } from '@consta/uikit/TextField'
import { useDebounce } from '@consta/uikit/useDebounce'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function SearchField() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [value, setValue] = useState(searchParams.get('search') || '')

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
			onChange={val => setValue(val || '')}
			placeholder='Поиск по названию'
			className='w-full max-w-xs'
			withClearButton
		/>
	)
}
