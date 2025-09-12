import { IconSortDownCenter } from '@consta/icons/IconSortDownCenter'
import { IconSortUpCenter } from '@consta/icons/IconSortUpCenter'
import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/Select'
import React from 'react'

import { SORT_BY_ITEMS, useStorageFilter } from '../model/useStorageFilter'
import { useStorageSearch } from '../model/useStorageSearch'

import { SearchInput } from './SearchInput'

export const StorageSearch: React.FC = () => {
	const { localSearch, handleSearchChange } = useStorageSearch()
	const { sortBy, sortOrder, handleSortChange, toggleSortOrder } = useStorageFilter()

	const selectedValue = SORT_BY_ITEMS.find(item => item.id === sortBy)
	const SortIcon = sortOrder === 'asc' ? IconSortUpCenter : IconSortDownCenter

	return (
		<div className='flex w-full flex-wrap items-center gap-2'>
			<Button view='ghost' size='s' onlyIcon iconLeft={SortIcon} onClick={toggleSortOrder} />
			<Select
				size='s'
				value={selectedValue}
				onChange={handleSortChange}
				items={SORT_BY_ITEMS}
				getItemLabel={item => item.label}
				placeholder='По названию'
				className='max-w-[140px] min-w-[140px] flex-none'
			/>

			<div className='min-w-[160px] flex-1'>
				<div className='relative'>
					<SearchInput value={localSearch} onChange={handleSearchChange} className='w-full' />
				</div>
			</div>
		</div>
	)
}
