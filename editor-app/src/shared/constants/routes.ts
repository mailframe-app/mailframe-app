import 'react-router-dom'

export const ROUTES = {
	TEMPLATES: '/editor',
	TEMPLATE: '/editor/:templateId'
} as const

export type PathParams = {
	[ROUTES.TEMPLATE]: {
		templateId: string
	}
}

declare module 'react-router-dom' {
	interface Register {
		params: PathParams
	}
}
