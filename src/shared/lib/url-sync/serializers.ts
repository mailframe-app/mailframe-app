import { stableStringify } from './stableStringify'

export const str = (def: {
	key: string
	default?: string
	debounceMs?: number
}) => ({
	key: def.key,
	default: def.default ?? '',
	debounceMs: def.debounceMs,
	parse: (v: string | null) => v ?? '',
	serialize: (v: string) => (v && v.length > 0 ? v : null)
})

export const num = (def: {
	key: string
	default?: number
	min?: number
	oneOf?: number[]
}) => ({
	key: def.key,
	default: def.default ?? 1,
	parse: (v: string | null) => {
		const n = Number(v ?? def.default ?? 0)
		if (Number.isNaN(n)) return def.default ?? 0
		if (def.oneOf && def.oneOf.length > 0)
			return def.oneOf.includes(n) ? n : def.oneOf[0]
		if (def.min !== undefined) return Math.max(def.min, n)
		return n
	},
	serialize: (v: number) => String(v)
})

export const enm = <T extends readonly string[]>(def: {
	key: string
	values: T
	default?: T[number]
}) => ({
	key: def.key,
	default: def.default as T[number] | undefined,
	parse: (v: string | null) =>
		v && (def.values as readonly string[]).includes(v)
			? (v as T[number])
			: (def.default as T[number] | undefined),
	serialize: (v: T[number] | undefined) => (v ? String(v) : null)
})

export const json = <T>(def: { key: string; default?: T }) => ({
	key: def.key,
	default: def.default as T | undefined,
	parse: (v: string | null) => {
		if (!v) return def.default as T | undefined
		try {
			return JSON.parse(v) as T
		} catch {
			return def.default as T | undefined
		}
	},
	serialize: (v: T | undefined) => {
		if (v == null) return null
		try {
			return stableStringify(v)
		} catch {
			return null
		}
	}
})

export type Serializer =
	| ReturnType<typeof str>
	| ReturnType<typeof num>
	| ReturnType<typeof enm>
	| ReturnType<typeof json<any>>
