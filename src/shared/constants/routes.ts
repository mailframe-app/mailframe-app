import 'react-router-dom'

export const PUBLIC_ROUTES = {
	// auth
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',
	FORGOT_PASSWORD: '/auth/forgot-password',
	RECOVERY_PASSWORD: '/auth/recovery-password/:token',
	AUTH_CALLBACK: '/auth/callback',
	VERIFY_EMAIL: '/auth/verify/:code',
	DOCS: 'https://docs.mailframe.ru/',

	// error
	500: '/500'
} as const

export const PRIVATE_ROUTES = {
	DASHBOARD: '/dashboard',

	ANALYTICS: '/analytics',

	// templates
	TEMPLATES: '/templates',
	TEMPLATE: '/templates/:templateId',

	// campaigns
	CAMPANIES: '/campaigns',
	CAMPAIGN_EDIT: '/campaigns/:campaignId/edit',
	CAMPAIGN_SCHEDULE: '/campaigns/:campaignId/schedule',
	CAMPAIGN_OVERVIEW: '/campaigns/:campaignId/overview',

	// settings
	PROFILE: '/settings/profile',
	MAIL_SETTINGS: '/settings/mail',
	SECURITY: '/settings/security',
	CONNECTIONS: '/settings/connections',

	// contacts/groups
	CONTACTS: '/contacts',
	CREATE_CONTACTS: '/contacts/create',
	GROUP_MEMBERS: '/contacts/groups/:groupId'
} as const

export type PathParams = {
	[PRIVATE_ROUTES.TEMPLATE]: {
		templateId: string
	}

	[PUBLIC_ROUTES.RECOVERY_PASSWORD]: {
		token: string
	}

	[PRIVATE_ROUTES.CAMPAIGN_SCHEDULE]: {
		campaignId: string
	}

	[PRIVATE_ROUTES.CAMPAIGN_OVERVIEW]: {
		campaignId: string
	}

	[PRIVATE_ROUTES.CAMPAIGN_EDIT]: {
		campaignId: string
	}

	[PRIVATE_ROUTES.GROUP_MEMBERS]: {
		groupId: string
	}
}

declare module 'react-router-dom' {
	interface Register {
		params: PathParams
	}
}
