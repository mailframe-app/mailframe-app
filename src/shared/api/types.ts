export type ErrorResponse = {
	statusCode: number
	error: string
	message: string
	timestamp?: string
	path?: string
	traceId?: string
	stack?: string
}
