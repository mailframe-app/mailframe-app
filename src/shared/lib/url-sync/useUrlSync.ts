import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type {
	ExtractDebounced,
	ExtractState,
	UrlParamDef,
	UrlSyncSchema,
	UseUrlSyncOptions
} from './types'

/**
 * Хук для синхронизации состояния с URL-параметрами
 */
export function useUrlSync<S extends UrlSyncSchema>(
	options: UseUrlSyncOptions<S>
) {
	const {
		schema,
		mode = 'replace',
		readOnMount = 'once',
		omitEmpty = true
	} = options
	const navigate = useNavigate()
	const location = useLocation()
	const didInitRef = useRef(false)
	const lastWrittenRef = useRef<string>('')

	// Создаем начальное состояние из URL
	const initialState = useMemo(() => {
		const sp = new URLSearchParams(location.search)
		const entries: [string, any][] = Object.entries(schema).map(([k, def]) => {
			const defTyped = def as UrlParamDef<any>
			const raw = sp.get(defTyped.key)
			const parsed = defTyped.parse(raw)
			return [k, parsed ?? defTyped.default]
		})
		return Object.fromEntries(entries) as ExtractState<S>
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [state, setState] = useState<ExtractState<S>>(initialState)
	const [debounced, setDebounced] = useState<ExtractDebounced<S>>({})

	// Дебаунс полей, которые это запрашивают
	useEffect(() => {
		const timers: number[] = []
		const next: Record<string, any> = {}
		for (const [k, def] of Object.entries(schema)) {
			const d = def as UrlParamDef<any>
			if (!d.debounceMs) continue
			const value = (state as any)[k]
			next[k] = (debounced as any)[k]
			const timer = window.setTimeout(() => {
				setDebounced(prev => ({ ...prev, [k]: value }))
			}, d.debounceMs)
			timers.push(timer)
		}
		return () => {
			timers.forEach(clearTimeout)
		}
	}, [state, schema])

	// Создаем строку поиска из состояния
	const buildSearch = (s: ExtractState<S>): string => {
		const sp = new URLSearchParams()
		for (const [k, def] of Object.entries(schema)) {
			const d = def as UrlParamDef<any>
			const v = (s as any)[k]
			const serialized = d.serialize(v)
			if (serialized == null) {
				if (!omitEmpty) sp.set(d.key, '')
			} else {
				sp.set(d.key, serialized)
			}
		}
		return sp.toString()
	}

	// При изменении состояния -> записываем в URL, если изменилось
	useEffect(() => {
		if (readOnMount === 'once' && !didInitRef.current) {
			didInitRef.current = true
			return
		}
		const nextStr = buildSearch(state)
		if (nextStr === lastWrittenRef.current) return
		lastWrittenRef.current = nextStr
		navigate(
			{
				pathname: location.pathname,
				search: nextStr ? `?${nextStr}` : ''
			},
			{ replace: mode === 'replace' }
		)
	}, [state, location.pathname, mode, navigate, readOnMount])

	const updateParams = (patch: Partial<ExtractState<S>>) =>
		setState(prev => ({ ...prev, ...patch }))

	return { state, setState, updateParams, debounced }
}
