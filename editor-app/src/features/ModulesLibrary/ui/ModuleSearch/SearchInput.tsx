import { IconSearchStroked } from '@consta/icons/IconSearchStroked'
import { TextField } from '@consta/uikit/TextField'
import { useDebounce } from '@consta/uikit/useDebounce'
import React, { useEffect, useState } from 'react'

import { useReusableBlocksStore } from '@/entities/ReusableBlocks'

export const SearchInput: React.FC = () => {
	const { searchQuery, setSearchQuery, fetchBlocks } = useReusableBlocksStore()
	const [value, setValue] = useState(searchQuery)

	const handleSearchChange = (newValue: string) => {
		setSearchQuery(newValue)
		fetchBlocks()
	}

	const debouncedOnSearchChange = useDebounce(handleSearchChange, 400)

	useEffect(() => {
		debouncedOnSearchChange(value)
	}, [value, debouncedOnSearchChange])

	useEffect(() => {
		if (searchQuery !== value) {
			setValue(searchQuery)
		}
	}, [searchQuery])

	return (
		<TextField
			placeholder='Поиск по названию'
			value={value}
			onChange={val => setValue(val || '')}
			className='flex-grow'
			size='s'
			leftSide={IconSearchStroked}
			withClearButton
		/>
	)
}
