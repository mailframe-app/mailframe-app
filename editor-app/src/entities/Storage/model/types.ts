import type { StorageState } from './storage.store'

export type StorageSlice = Partial<StorageState>
export type StorageStateCreator = (
	set: (state: Partial<StorageState> | ((state: StorageState) => Partial<StorageState>)) => void,
	get: () => StorageState
) => StorageSlice
