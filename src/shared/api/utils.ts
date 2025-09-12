// Детерминированная stringify для создания стабильных ключей запроса
export function stableStringify(value: unknown): string {
	const seen = new WeakSet()
	return (
		JSON.stringify(value, function (_key, val) {
			if (val && typeof val === 'object') {
				if (seen.has(val as object)) {
					return
				}
				seen.add(val as object)
				if (!Array.isArray(val)) {
					const sorted: Record<string, unknown> = {}
					for (const k of Object.keys(val as Record<string, unknown>).sort()) {
						sorted[k] = (val as Record<string, unknown>)[k]
					}
					return sorted
				}
			}
			return val
		}) || ''
	)
}

export function stableParams<
	TParams extends Record<string, unknown> | undefined
>(params?: TParams): string | undefined {
	if (!params) return undefined
	return stableStringify(params)
}
