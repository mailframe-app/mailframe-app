import React, { type Context, type ReactNode, createContext, useContext, useState } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'

/**
 * Создаёт строгий Context (кидает ошибку, если нет Provider-а).
 */
export function createStrictContext<T>() {
	return createContext<T | null>(null)
}
export function useStrictContext<T>(context: Context<T | null>) {
	const value = useContext(context)
	if (value === null) throw new Error('Strict context not passed')
	return value as T
}

/**
 * Обёртка для создания связки Context + Zustand Store
 * @param factory - функция, возвращающая zustand store (create)
 */
export function createStoreContext<S, P = void>(
	factory: (params: P) => UseBoundStore<StoreApi<S>>
) {
	// Контекст для zustand store
	const context = createStrictContext<UseBoundStore<StoreApi<S>>>()

	// Provider, инициализирующий store только 1 раз
	const Provider: React.FC<{ children?: ReactNode; value: P }> = ({ children, value }) => {
		const [store] = useState(() => factory(value))
		return <context.Provider value={store}>{children}</context.Provider>
	}

	// Хук для использования store из context
	function useStore<R = S>(selector?: (store: S) => R): R {
		const zustandStore = useStrictContext(context)
		return zustandStore(selector ?? ((s: S) => s as unknown as R))
	}

	return {
		Provider,
		useStore
	}
}
