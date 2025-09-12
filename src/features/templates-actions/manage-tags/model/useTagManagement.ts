import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib'

import {
	type TagResponse,
	tagsListQuery,
	useCreateTag
} from '@/entities/template-tags'

interface UseTagManagementParams {
	initialTags?: TagResponse[]
}

export function useTagManagement({ initialTags = [] }: UseTagManagementParams) {
	const [selectedTags, setSelectedTags] = useState<TagResponse[] | null>(
		initialTags
	)
	const [searchValue, setSearchValue] = useState('')

	const { data: allTags = [], isLoading } = useQuery(
		tagsListQuery({ type: 'templates' })
	)

	const createTagMutation = useCreateTag()

	const handleCreateTag = async (tagName: string) => {
		const normalizedName = tagName.trim()
		if (!normalizedName) return

		const existingTag = allTags.find(
			tag => tag.name.toLowerCase() === normalizedName.toLowerCase()
		)

		if (existingTag) {
			if (!(selectedTags || []).some(tag => tag.id === existingTag.id)) {
				setSelectedTags(prev => [...(prev || []), existingTag])
			}
			setSearchValue('')
			return
		}

		try {
			const newTag = await createTagMutation({
				name: normalizedName,
				type: 'template'
			})
			setSelectedTags(prev => [...(prev || []), newTag])
			setSearchValue('')
			showCustomToast({
				title: `Тег "${newTag.name}" успешно создан и добавлен`,
				type: 'success'
			})
		} catch (error) {
			showCustomToast({
				title: 'Ошибка при создании тега',
				type: 'error'
			})
		}
	}

	const filteredItems = useMemo(() => {
		if (!searchValue) {
			return allTags
		}
		return allTags.filter(tag =>
			tag.name.toLowerCase().includes(searchValue.toLowerCase())
		)
	}, [allTags, searchValue])

	return {
		items: filteredItems,
		value: selectedTags,
		onChange: setSelectedTags,
		onInput: setSearchValue,
		onCreate: handleCreateTag,
		isLoading,
		searchValue
	}
}
