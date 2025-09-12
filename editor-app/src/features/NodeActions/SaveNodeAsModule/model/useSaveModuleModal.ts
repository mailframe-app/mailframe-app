import { useEditor } from '@craftjs/core'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib'
import { extractBlockWithChildren } from '@/shared/lib/blockExtractor'
import { convertNodesToHtml } from '@/shared/lib/convertNodesToHtml'

import { type CreateBlockDto, useReusableBlocksStore } from '@/entities/ReusableBlocks'
import { type TagResponseDto, useTagsStore } from '@/entities/Tags'

interface UseSaveModuleModalProps {
	isOpen: boolean
	nodeId: string | null
	onClose: () => void
}

export const useSaveModuleModal = ({ isOpen, nodeId, onClose }: UseSaveModuleModalProps) => {
	const { addBlock } = useReusableBlocksStore()
	const { tags: allTags, addTag } = useTagsStore()
	const { query } = useEditor()

	const [name, setName] = useState('')
	const [selectedTags, setSelectedTags] = useState<TagResponseDto[] | null>([])
	const [searchValue, setSearchValue] = useState('')
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!isOpen) {
			setName('')
			setSelectedTags([])
			setSearchValue('')
			setError(null)
			setSaving(false)
		}
	}, [isOpen])

	const blockData = useMemo(() => {
		if (!isOpen || !nodeId) return null
		try {
			const allNodes = query.getSerializedNodes()
			const nodes = extractBlockWithChildren(nodeId, allNodes)
			const html = convertNodesToHtml(nodes)
			return { nodes, html }
		} catch (err) {
			console.error('Error extracting block data:', err)
			setError('Не удалось получить данные блока.')
			return null
		}
	}, [isOpen, nodeId, query])

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
		try {
			const newTag = await addTag({ name: normalizedName })
			if (newTag) {
				setSelectedTags(prev => [...(prev || []), newTag])
				setSearchValue('')
				showCustomToast({ title: `Тег "${newTag.name}" создан и добавлен`, type: 'success' })
			}
		} catch (e) {
			showCustomToast({ title: 'Ошибка при создании тега', type: 'error' })
		}
	}

	const handleSave = useCallback(async () => {
		if (!name.trim() || !blockData) return
		setSaving(true)
		setError(null)
		try {
			const requestData: CreateBlockDto = {
				name: name.trim(),
				content: blockData.nodes,
				html: blockData.html,
				tags: (selectedTags || []).map(tag => tag.id)
			}
			await addBlock(requestData)
			onClose()
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось сохранить модуль'
			setError(message)
			console.error('Error saving module:', err)
		} finally {
			setSaving(false)
		}
	}, [name, blockData, selectedTags, addBlock, onClose])

	const filteredTagItems = useMemo(() => {
		if (!searchValue) return allTags
		return allTags.filter(t => t.name.toLowerCase().includes(searchValue.toLowerCase()))
	}, [allTags, searchValue])

	return {
		name,
		setName,
		saving,
		error,
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
