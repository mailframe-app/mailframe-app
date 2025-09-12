export type UrlParamDef<T> = {
	key: string
	default?: T
	parse: (value: string | null) => T
	serialize: (value: T) => string | null
	debounceMs?: number
}

export type UrlSyncSchema = Record<string, UrlParamDef<any>>

export type UseUrlSyncOptions<S extends UrlSyncSchema> = {
	schema: S
	mode?: 'replace' | 'push'
	readOnMount?: 'once' | 'always'
	omitEmpty?: boolean
}

export type ExtractState<S extends UrlSyncSchema> = {
	[K in keyof S]: ReturnType<S[K]['parse']>
}

export type ExtractDebounced<S extends UrlSyncSchema> = Partial<ExtractState<S>>
