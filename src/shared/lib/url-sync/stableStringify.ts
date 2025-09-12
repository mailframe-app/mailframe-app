export function stableStringify(value: unknown): string {
	return JSON.stringify(sortDeep(value))
}

function sortDeep(input: any): any {
	if (Array.isArray(input)) {
		return input.map(sortDeep)
	}
	if (input && typeof input === 'object') {
		const keys = Object.keys(input).sort()
		const out: Record<string, any> = {}
		for (const k of keys) out[k] = sortDeep(input[k])
		return out
	}
	return input
}
