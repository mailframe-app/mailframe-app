import { Select } from '@consta/uikit/SelectCanary'
import React from 'react'

import type { TagResponse } from '@/entities/template-tags'

interface TagSelectorProps {
	items: TagResponse[]
	value: TagResponse[] | null
	onChange: (value: TagResponse[] | null) => void
	onInput?: (value: string) => void
	onCreate?: (value: string) => void
	isLoading?: boolean
	searchValue?: string
}

export const TagSelector: React.FC<TagSelectorProps> = ({
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
			multiple
			items={items}
			value={value}
			onChange={onChange}
			getItemLabel={tag => tag.name}
			getItemKey={tag => tag.id}
			input
			onInput={onInput}
			onCreate={!items.length && searchValue ? onCreate : undefined}
			isLoading={isLoading}
			placeholder='Выберите или создайте тег'
			labelForEmptyItems={searchValue ? 'Новый тег' : 'Список тегов пуст'}
		/>
	)
}
