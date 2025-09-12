import { IconSearchStroked } from '@consta/icons/IconSearchStroked'
import { TextField, type TextFieldPropOnChange } from '@consta/uikit/TextField'
import React from 'react'

interface SearchInputProps {
	value: string
	onChange: (value: string | null) => void
	className?: string
	withClearButton?: boolean
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, className }) => {
	const handleChange: TextFieldPropOnChange = value => {
		onChange(value)
	}

	return (
		<TextField
			placeholder='Поиск'
			value={value}
			onChange={handleChange}
			className={className ?? 'w-full'}
			size='s'
			leftSide={IconSearchStroked}
			withClearButton
		/>
	)
}
