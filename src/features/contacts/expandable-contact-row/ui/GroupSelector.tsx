import { Select } from '@consta/uikit/SelectCanary'
import React from 'react'

import type { GroupResponseDto } from '@/entities/contacts'

interface GroupSelectorProps {
	items: GroupResponseDto[]
	value: GroupResponseDto[] | null
	onChange: (value: GroupResponseDto[] | null) => void
	onInput?: (value: string) => void
	isLoading?: boolean
	searchValue?: string
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
	items,
	value,
	onChange,
	onInput,
	isLoading,
	searchValue
}) => {
	return (
		<Select
			multiple
			items={items}
			value={value}
			onChange={onChange}
			getItemLabel={group => group.name}
			getItemKey={group => group.id}
			input
			onInput={onInput}
			isLoading={isLoading}
			placeholder='Выберите группы'
			labelForEmptyItems={
				searchValue ? 'Группы не найдены' : 'Список групп пуст'
			}
		/>
	)
}
