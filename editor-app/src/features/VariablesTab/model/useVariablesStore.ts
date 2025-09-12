import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import type { IVariableItem } from './types'

const generateId = (): string =>
	`id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

export interface IVariablesStore {
	items: IVariableItem[]
	setAll: (items: IVariableItem[]) => void
	add: (item?: Partial<IVariableItem>) => void
	update: (id: string, patch: Partial<IVariableItem>) => void
	remove: (id: string) => void
	reset: () => void
}

export const useVariablesStore = create<IVariablesStore>()(
	devtools(
		persist(
			(set, get) => ({
				items: [],
				setAll: items => set({ items }),
				add: item =>
					set({
						items: [
							...get().items,
							{
								id: generateId(),
								token: '',
								field: null,
								defaultValue: '',
								required: false,
								...item
							}
						]
					}),
				update: (id, patch) =>
					set({
						items: get().items.map(i => (i.id === id ? { ...i, ...patch } : i))
					}),
				remove: id =>
					set({
						items: get().items.filter(i => i.id !== id)
					}),
				reset: () => set({ items: [] })
			}),
			{
				name: 'gp:variables:items:v1',
				storage: createJSONStorage(() => localStorage)
			}
		)
	)
)
