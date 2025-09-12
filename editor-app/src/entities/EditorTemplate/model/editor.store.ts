import { create } from 'zustand'

import type { TVariableMapping } from '@/features/VariablesTab'

import { createStoreContext } from '@/shared/lib'

import type { TemplateDetailDto } from '../api'
import { getTemplate, updateTemplate } from '../api'

import { debounce } from './autosave.helpers'

interface EditorTemplateStore {
	template: TemplateDetailDto | null
	originalTemplate: TemplateDetailDto | null
	hasUnsavedChanges: boolean
	lastSaved: Date | null
	autosaveConfig: {
		debounceDelay: number
		forceSaveInterval: number
		enabled: boolean
	}
	loading: {
		fetchingTemplate: boolean
		savingTemplate: boolean
	}
	errors: {
		fetchTemplate: string | null
		saveTemplate: string | null
	}
	autosaveStatus: 'idle' | 'pending' | 'success' | 'error'

	// Состояние режима предпросмотра
	isPreviewMode: boolean

	fetchTemplate: (id: string) => Promise<void>
	setTemplate: (template: TemplateDetailDto) => void
	updateEditorState: (editorState: Record<string, unknown>) => void
	updateBodyHtml: (bodyHtml: string) => void
	updateName: (name: string) => void
	updateVariableMapping: (mapping: TVariableMapping) => void
	saveTemplate: (immediate?: boolean) => Promise<void>
	toggleAutoSave: (enabled: boolean) => void
	cleanup: () => void

	// Методы для управления предпросмотром
	openPreview: () => void
	closePreview: () => void
}

const defaultAutosaveConfig = {
	debounceDelay: 5000,
	forceSaveInterval: 300000,
	enabled: true
}

const createEditorTemplateStore = (initialTemplate: TemplateDetailDto | null = null) => {
	// Переменная для хранения интервала автосохранения
	let autoSaveInterval: NodeJS.Timeout | null = null

	const store = create<EditorTemplateStore>((set, get) => {
		const debouncedSave = debounce(() => {
			get().saveTemplate()
		}, defaultAutosaveConfig.debounceDelay)

		// Настраиваем автосохранение, если есть начальный шаблон
		if (initialTemplate) {
			autoSaveInterval = setInterval(() => {
				const state = get()
				if (state.hasUnsavedChanges && state.autosaveConfig.enabled) {
					state.saveTemplate()
				}
			}, defaultAutosaveConfig.forceSaveInterval)
		}

		return {
			template: initialTemplate,
			originalTemplate: initialTemplate,
			hasUnsavedChanges: false,
			lastSaved: initialTemplate ? new Date() : null,
			autosaveConfig: defaultAutosaveConfig,
			loading: {
				fetchingTemplate: false,
				savingTemplate: false
			},
			errors: {
				fetchTemplate: null,
				saveTemplate: null
			},
			autosaveStatus: 'idle',

			// Начальное состояние для режима предпросмотра
			isPreviewMode: false,

			fetchTemplate: async (id: string) => {
				set({
					loading: { ...get().loading, fetchingTemplate: true },
					errors: { ...get().errors, fetchTemplate: null }
				})
				try {
					const templateData = await getTemplate(id)
					set({
						template: templateData,
						originalTemplate: templateData,
						loading: { ...get().loading, fetchingTemplate: false },
						hasUnsavedChanges: false,
						lastSaved: new Date()
					})

					// Настраиваем автосохранение после загрузки шаблона
					if (!autoSaveInterval) {
						autoSaveInterval = setInterval(() => {
							get().saveTemplate()
						}, get().autosaveConfig.forceSaveInterval)
					}
				} catch {
					set({
						loading: { ...get().loading, fetchingTemplate: false },
						errors: { ...get().errors, fetchTemplate: 'Ошибка загрузки шаблона' }
					})
				}
			},
			setTemplate: (template: TemplateDetailDto) => {
				set({ template, originalTemplate: template, hasUnsavedChanges: false })

				// Настраиваем автосохранение после установки шаблона
				if (!autoSaveInterval) {
					autoSaveInterval = setInterval(() => {
						get().saveTemplate()
					}, get().autosaveConfig.forceSaveInterval)
				}
			},
			updateEditorState: (editorState: Record<string, unknown>) => {
				const { template } = get()
				if (template) {
					set({
						template: { ...template, editorState },
						hasUnsavedChanges: true
					})
					debouncedSave()
				}
			},
			updateBodyHtml: (bodyHtml: string) => {
				const { template } = get()
				if (template) {
					set({
						template: { ...template, bodyHtml },
						hasUnsavedChanges: true
					})
					debouncedSave()
				}
			},
			updateName: (name: string) => {
				const { template } = get()
				if (template) {
					set({
						template: { ...template, name },
						hasUnsavedChanges: true
					})
					get().saveTemplate(true)
				}
			},
			updateVariableMapping: (mapping: TVariableMapping) => {
				const { template } = get()
				if (template) {
					const compatibleMapping = Object.fromEntries(
						Object.entries(mapping).map(([key, value]) => [
							key,
							{ fieldKey: value.fieldKey, default: value.default ?? '' }
						])
					)
					set({
						template: { ...template, variableMapping: compatibleMapping },
						hasUnsavedChanges: true
					})
					get().saveTemplate(true)
				}
			},
			saveTemplate: async (immediate = false) => {
				const { template, hasUnsavedChanges, autosaveConfig } = get()

				if (!template || (!hasUnsavedChanges && !immediate)) {
					return
				}

				if (!autosaveConfig.enabled && !immediate) {
					return
				}

				set({ loading: { ...get().loading, savingTemplate: true }, autosaveStatus: 'pending' })
				try {
					const { id, name, editorState, bodyHtml, variableMapping } = template
					await updateTemplate(id, { name, editorState, bodyHtml, variableMapping })
					set({
						hasUnsavedChanges: false,
						lastSaved: new Date(),
						loading: { ...get().loading, savingTemplate: false },
						errors: { ...get().errors, saveTemplate: null },
						autosaveStatus: 'success',
						originalTemplate: template
					})
				} catch {
					set({
						loading: { ...get().loading, savingTemplate: false },
						errors: { ...get().errors, saveTemplate: 'Ошибка сохранения' },
						autosaveStatus: 'error'
					})
				}
			},
			toggleAutoSave: (enabled: boolean) => {
				set({ autosaveConfig: { ...get().autosaveConfig, enabled } })
			},
			cleanup: () => {
				if (autoSaveInterval) {
					clearInterval(autoSaveInterval)
					autoSaveInterval = null
				}
			},

			// Реализация методов для предпросмотра
			openPreview: () => {
				set({ isPreviewMode: true })
			},
			closePreview: () => {
				set({ isPreviewMode: false })
			}
		}
	})

	return store
}

export const { Provider: EditorTemplateProvider, useStore: useEditorTemplateStore } =
	createStoreContext(createEditorTemplateStore)
