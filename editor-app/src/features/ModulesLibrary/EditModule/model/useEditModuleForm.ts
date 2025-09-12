import { useCallback, useMemo, useState } from 'react'

import type { Module } from '../../model/types'

import { useReusableBlocksStore } from '@/entities/ReusableBlocks'
import { type TagResponseDto, useTagsStore } from '@/entities/Tags'

interface UseEditModuleFormProps {
	module: Module
	onClose: () => void
}

export const useEditModuleForm = ({ module, onClose }: UseEditModuleFormProps) => {
	const { editBlock } = useReusableBlocksStore()
	const { tags: allTags, addTag } = useTagsStore()

	const [name, setName] = useState(module.name)

	const initialTags = useMemo(
		() =>
			(module.tags || [])
				.map(tag =>
					typeof tag === 'string' ? allTags.find(t => t.id === tag || t.slug === tag) : tag
				)
				.filter((t): t is TagResponseDto => !!t),
		[module.tags, allTags]
	)

	const [selectedTags, setSelectedTags] = useState<TagResponseDto[] | null>(initialTags)
	const [searchValue, setSearchValue] = useState('')

	const handleCreateTag = async (tagName: string) => {
		const normalizedName = tagName.trim()
		if (!normalizedName) return
		const existingTag = allTags.find(t => t.name.toLowerCase() === normalizedName.toLowerCase())
		if (existingTag) {
			if (!(selectedTags || []).some(t => t.id === existingTag.id)) {
				setSelectedTags(prev => [...(prev || []), existingTag])
			}
			setSearchValue('')
			return
		}
		const newTag = await addTag({ name: normalizedName })
		if (newTag) {
			setSelectedTags(prev => [...(prev || []), newTag])
			setSearchValue('')
		}
	}

	const handleSave = useCallback(async () => {
		await editBlock(module.id, {
			name: name.trim(),
			tags: (selectedTags || []).map(t => t.id)
		})
		onClose()
	}, [module.id, name, selectedTags, editBlock, onClose])

	const filteredTagItems = useMemo(() => {
		if (!searchValue) return allTags
		return allTags.filter(t => t.name.toLowerCase().includes(searchValue.toLowerCase()))
	}, [allTags, searchValue])

	return {
		name,
		setName,
		tagSelector: {
			items: filteredTagItems,
			value: selectedTags,
			onChange: setSelectedTags,
			onInput: setSearchValue,
			onCreate: handleCreateTag,
			searchValue
		},
		handleSave
	}
}
