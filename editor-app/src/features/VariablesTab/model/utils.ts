import type { IVariableItem } from './types'

export const tokenRegex = /^\{\{[a-zA-Z0-9_]+\}\}$/
export const isValidToken = (token: string) => tokenRegex.test(token)

export const normalizeTokenInput = (raw: string): string => {
	const trimmed = (raw || '').trim()
	if (!trimmed) return ''
	const bare = trimmed
		.replace(/^\{\{/, '')
		.replace(/\}\}$/, '')
		.replace(/[.\-\s]+/g, '_')
	return `{{${bare}}}`
}

export const getDuplicateTokens = (rows: IVariableItem[]) => {
	const counts = rows.reduce<Record<string, number>>((acc, r) => {
		const key = r.token.trim()
		if (!key) return acc
		acc[key] = (acc[key] || 0) + 1
		return acc
	}, {})
	return new Set(Object.keys(counts).filter(k => counts[k] > 1))
}
