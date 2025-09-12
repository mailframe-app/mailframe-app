import { useDebounce } from '@consta/uikit/useDebounce'
import { useEffect, useRef } from 'react'

export type UseColumnsWidthPersistenceOptions = {
	isSystemKey?: (key: string) => boolean
	min?: number
	max?: number
	debounceMs?: number
	keyToId?: Map<string, string>
	onCommit?: (
		updates: Array<{ id: string; key: string; width: number }>
	) => Promise<void> | void
	shouldSend?: (key: string, width: number) => boolean
	ignoreInitialMs?: number
	enabledByDefault?: boolean
	cooldownMs?: number
}

export function useColumnsWidthPersistence(
	opts?: UseColumnsWidthPersistenceOptions
) {
	const {
		isSystemKey = (k: string) => k === 'select' || k === 'status',
		min = 50,
		max = 500,
		debounceMs = 300,
		keyToId,
		onCommit,
		shouldSend,
		ignoreInitialMs = 400,
		enabledByDefault = false,
		cooldownMs = 0
	} = opts || {}

	const observersRef = useRef<Map<string, ResizeObserver>>(new Map())
	const pendingRef = useRef<Record<string, number>>({})
	const lastObservedRef = useRef<Record<string, number>>({})
	const startedAtRef = useRef<number>(Date.now())
	const enabledRef = useRef<boolean>(enabledByDefault)
	const cooldownUntilRef = useRef<number>(0)

	const commit = useDebounce(async () => {
		if (cooldownMs && Date.now() < cooldownUntilRef.current) return

		const entries = Object.entries(pendingRef.current)
		if (entries.length === 0) return

		const updates: Array<{ id: string; key: string; width: number }> = []
		for (const [key, width] of entries) {
			const id = keyToId?.get(key)
			if (!id) continue
			const clamped = Math.max(min, Math.min(max, Math.round(width)))
			if (shouldSend && !shouldSend(key, clamped)) continue
			updates.push({ id, key, width: clamped })
		}

		// clear pending after snapshot
		pendingRef.current = {}

		if (updates.length && onCommit) {
			await onCommit(updates)
			if (cooldownMs) cooldownUntilRef.current = Date.now() + cooldownMs
		}
	}, debounceMs)

	// Cleanup all observers on unmount
	useEffect(() => {
		return () => {
			observersRef.current.forEach(o => o.disconnect())
			observersRef.current.clear()
		}
	}, [])

	const attachObserver = (key: string, node: HTMLElement) => {
		if (!node || isSystemKey(key)) return
		// replace existing observer for this key
		const prev = observersRef.current.get(key)
		if (prev) prev.disconnect()
		const ro = new ResizeObserver(entries => {
			// ignore initial flurry of layout passes
			if (!enabledRef.current) return
			if (
				ignoreInitialMs &&
				Date.now() - startedAtRef.current < ignoreInitialMs
			) {
				return
			}
			for (const entry of entries) {
				const width = entry.contentRect?.width
				if (!width || !isFinite(width)) continue
				const rounded = Math.round(width)
				if (lastObservedRef.current[key] === rounded) continue
				lastObservedRef.current[key] = rounded
				pendingRef.current[key] = rounded
				commit()
			}
		})
		ro.observe(node)
		observersRef.current.set(key, ro)
	}

	const registerHeaderRef = (key: string) => (el: HTMLElement | null) => {
		const prev = observersRef.current.get(key)
		if (!el) {
			if (prev) {
				prev.disconnect()
				observersRef.current.delete(key)
			}
			return
		}
		attachObserver(key, el as HTMLElement)
	}

	const getHeaderProps = (key: string) => ({
		ref: registerHeaderRef(key),
		'data-col-key': key
	})

	const enable = () => {
		enabledRef.current = true
	}
	const disable = () => {
		enabledRef.current = false
	}

	return { getHeaderProps, registerHeaderRef, enable, disable }
}
