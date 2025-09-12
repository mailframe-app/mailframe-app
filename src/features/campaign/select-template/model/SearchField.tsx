import { TextField } from '@consta/uikit/TextField'

interface SearchFieldProps {
	value: string
	onChange: (value: string) => void
}

export function SearchField({ value, onChange }: SearchFieldProps) {
	return (
		<TextField
			value={value}
			onChange={val => onChange(val || '')}
			placeholder='Поиск по названию'
			className='w-full max-w-xs'
			withClearButton
		/>
	)
}
