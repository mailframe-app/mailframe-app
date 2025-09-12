import { create } from 'zustand'

import { createStoreContext } from '@/shared/lib'

import type { CreateTagDto, GetTagsResponseDto, TagResponseDto } from '../api'
import { createTag, deleteTag, getTags } from '../api'

export interface TagsState {
	// Данные
	tags: TagResponseDto[]

	// Состояния
	isLoading: boolean
	error: string | null

	// Действия
	fetchTags: () => Promise<void>
	addTag: (tag: CreateTagDto) => Promise<TagResponseDto | null>
	removeTag: (id: string) => Promise<boolean>
}

const createTagsStore = (initialData: GetTagsResponseDto) =>
	create<TagsState>(set => ({
		tags: initialData,
		isLoading: false,
		error: null,

		fetchTags: async () => {
			set({ isLoading: true, error: null })
			try {
				const response = await getTags()
				set({ tags: response, isLoading: false })
			} catch (error) {
				set({
					isLoading: false,
					error: error instanceof Error ? error.message : 'Ошибка при загрузке тегов'
				})
			}
		},

		addTag: async tagData => {
			set({ isLoading: true, error: null })
			try {
				const newTag = await createTag(tagData)
				set(state => ({
					tags: [...state.tags, newTag],
					isLoading: false
				}))
				return newTag
			} catch (error) {
				set({
					isLoading: false,
					error: error instanceof Error ? error.message : 'Ошибка при создании тега'
				})
				return null
			}
		},

		removeTag: async id => {
			set({ isLoading: true, error: null })
			try {
				const response = await deleteTag(id)
				if (response.success) {
					set(state => ({
						tags: state.tags.filter(tag => tag.id !== id),
						isLoading: false
					}))
					return true
				}
				return false
			} catch (error) {
				set({
					isLoading: false,
					error: error instanceof Error ? error.message : 'Ошибка при удалении тега'
				})
				return false
			}
		}
	}))

export const { Provider: TagsStoreProvider, useStore: useTagsStore } =
	createStoreContext(createTagsStore)
