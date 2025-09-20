import { useMemo, useState } from 'react'

import { type GroupResponseDto, useGroups } from '@/entities/contacts'

interface UseGroupManagementParams {
	contactId: string
	initialGroups?: GroupResponseDto[]
}

export function useGroupManagement({
	initialGroups = []
}: UseGroupManagementParams) {
	const [selectedGroups, setSelectedGroups] =
		useState<GroupResponseDto[]>(initialGroups)
	const [searchValue, setSearchValue] = useState('')

	// Загружаем все группы
	const { data: groupsResponse, isLoading } = useGroups()
	const allGroups = groupsResponse?.items || []

	const filteredItems = useMemo(() => {
		if (!searchValue) {
			return allGroups
		}
		return allGroups.filter((group: GroupResponseDto) =>
			group.name.toLowerCase().includes(searchValue.toLowerCase())
		)
	}, [allGroups, searchValue])

	return {
		items: filteredItems,
		value: selectedGroups,
		onChange: setSelectedGroups,
		onInput: setSearchValue,
		isLoading,
		searchValue
	}
}
