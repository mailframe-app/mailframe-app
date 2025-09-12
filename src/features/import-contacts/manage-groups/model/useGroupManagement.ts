import { useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { useCreateGroupMutation, useGroups } from '@/entities/contacts'

type GroupLike = { id: string; name: string }
interface UseGroupManagementParams {
	value: GroupLike | null
	onChange: (value: GroupLike | null) => void
}

export function useGroupManagement({
	value,
	onChange
}: UseGroupManagementParams) {
	const [searchValue, setSearchValue] = useState('')

	const { data, isLoading } = useGroups()
	const allGroups = useMemo(() => data?.items || [], [data])

	const createGroupMutation = useCreateGroupMutation()

	const handleCreateGroup = async (groupName: string) => {
		const normalizedName = groupName.trim()
		if (!normalizedName) return

		const existingGroup = allGroups.find(
			group => group.name.toLowerCase() === normalizedName.toLowerCase()
		)

		if (existingGroup) {
			onChange(existingGroup)
			setSearchValue('')
			return
		}

		try {
			const newGroup = await createGroupMutation.mutateAsync({
				name: normalizedName
			})
			onChange(newGroup)
			setSearchValue('')
			showCustomToast({
				title: `Группа "${newGroup.name}" успешно создана и выбрана`,
				type: 'success'
			})
		} catch (error) {
			showCustomToast({
				title: 'Ошибка при создании группы',
				type: 'error'
			})
		}
	}

	const filteredItems = useMemo(() => {
		const baseItems: GroupLike[] = allGroups.filter(group =>
			group.name.toLowerCase().includes(searchValue.toLowerCase())
		)

		if (searchValue) {
			const exactMatch = allGroups.some(
				g => g.name.toLowerCase() === searchValue.toLowerCase()
			)
			if (!exactMatch) {
				const createOption = {
					id: 'CREATE_NEW_GROUP',
					name: `Создать "${searchValue}"`
				}
				return [createOption, ...baseItems]
			}
		}

		return baseItems
	}, [allGroups, searchValue])

	return {
		items: filteredItems,
		value,
		onChange,
		onInput: setSearchValue,
		onCreate: handleCreateGroup,
		isLoading,
		searchValue
	}
}
