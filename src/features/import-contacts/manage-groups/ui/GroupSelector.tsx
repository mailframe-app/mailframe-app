import { Select } from '@consta/uikit/SelectCanary'
import React from 'react'

import type { GroupResponseDto } from '@/entities/contacts'

export type CreateGroupOption = { id: 'CREATE_NEW_GROUP'; name: string }

type GroupLike = { id: string; name: string }

interface GroupSelectorProps {
	items: (GroupLike | CreateGroupOption)[]
	value: GroupLike | null
	onChange: (value: GroupLike | null) => void
	onInput?: (value: string) => void
	onCreate?: (value: string) => void
	isLoading?: boolean
	searchValue?: string
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
	items,
	value,
	onChange,
	onInput,
	onCreate,
	isLoading,
	searchValue
}) => {
	return (
		<Select
			clearButton
			items={items}
			value={value}
			onChange={item => {
				if (item?.id === 'CREATE_NEW_GROUP') {
					if (onCreate && searchValue) {
						onCreate(searchValue)
					}
				} else {
					onChange(item as GroupResponseDto | null)
				}
			}}
			getItemLabel={(group: GroupLike | CreateGroupOption) => group.name}
			getItemKey={(group: GroupLike | CreateGroupOption) => group.id}
			input
			onInput={onInput}
			isLoading={isLoading}
			placeholder='Выберите или создайте группу'
			labelForEmptyItems={searchValue ? 'Новая группа' : 'Список групп пуст'}
		/>
	)
}
