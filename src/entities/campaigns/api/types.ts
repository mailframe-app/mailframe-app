export type CampaignStatus =
	| 'DRAFT'
	| 'QUEUED'
	| 'SCHEDULED'
	| 'SENDING'
	| 'SENT'
	| 'CANCELED'

export interface CreateCampaignRequest {
	name?: string
	smtpSettingsId?: string
	contactGroupId?: string
	templateId?: string
	subject?: string
	scheduledAt?: string
}

export interface UpdateCampaignRequest {
	name?: string
	smtpSettingsId?: string
	contactGroupId?: string
	templateId?: string
	subject?: string
	scheduledAt?: string
}

export interface ScheduleCampaignRequest {
	scheduledAt: string
}

export type CampaignsSortBy =
	| 'createdAt'
	| 'updatedAt'
	| 'scheduledAt'
	| 'name'
	| 'status'
export type SortOrder = 'asc' | 'desc'

export interface ListCampaignsQuery {
	status?: CampaignStatus | CampaignStatus[]
	search?: string
	from?: string
	to?: string
	page?: number
	limit?: number
	sortBy?: CampaignsSortBy
	sortOrder?: SortOrder
}

export interface CampaignGroupRef {
	id: string
	name: string
}

export interface CampaignListItem {
	id: string
	name: string
	status: CampaignStatus
	subject?: string | null
	createdAt: string
	sentAt?: string | null
	scheduledAt?: string | null
	updatedAt: string
	recipientsCount: number
	sentCount: number
	opensCount: number
	clicksCount: number
	openRate: number
	clickRate: number
	group?: CampaignGroupRef | null
}

export interface ListCampaignsResponse {
	page: number
	limit: number
	total: number
	items: CampaignListItem[]
}

export interface CampaignErrorAggregate {
	message: string
	count: number
	share: number
	lastAt: string | null
}

export interface CampaignStatsResponse {
	campaignId: string
	recipientsCount: number
	sentCount: number
	failedCount: number
	opensCount: number
	clicksCount: number
	unsubscribesCount: number
	createdAt: string
	updatedAt?: string
	errorsTop?: CampaignErrorAggregate[]
}

export interface GetCampaignStatsQuery {
	errorsLimit?: number
}

export type LogStatusFilter =
	| 'PENDING'
	| 'SENT'
	| 'FAILED'
	| 'OPENED'
	| 'CLICKED'

export interface GetCampaignLogsQuery {
	status?: LogStatusFilter
	page?: number
	limit?: number
}

export interface CampaignLogItem {
	id: string
	status: LogStatusFilter
	errorMessage?: string | null
	sentAt?: string | null
	openedAt?: string | null
	clickedAt?: string | null
	email: string
}

export interface GetCampaignLogsResponse {
	page: number
	limit: number
	total: number
	items: CampaignLogItem[]
}

export type CalendarEventType =
	| 'scheduled'
	| 'sending'
	| 'queued'
	| 'sent'
	| 'canceled'
	| 'draft'

export interface CalendarEventItem {
	id: string
	title: string
	status: string
	eventType: CalendarEventType
	at: string
}

export interface CalendarSummaryBucket {
	dateKey: string
	scheduledCount: number
	sendingCount: number
	sentCount: number
	canceledCount: number
	total: number
}

export type CampaignCalendarResponse =
	| { total: number; items: CalendarEventItem[] }
	| { buckets: CalendarSummaryBucket[] }

export interface ActionSuccessResponse {
	success: boolean
}

export interface RetryFailedResponse {
	success: boolean
	queued: boolean
	failedCount: number
}

export type CampaignCalendarStatus = CampaignStatus
export type CampaignCalendarView = 'events' | 'summary'
export type CampaignCalendarGroupBy = 'day' | 'week' | 'month'

export interface GetCampaignCalendarQuery {
	from: string
	to: string
	tz?: string
	statuses?: CampaignCalendarStatus[]
	view?: CampaignCalendarView
	groupBy?: CampaignCalendarGroupBy
	search?: string
	contactGroupId?: string
	templateId?: string
	limit?: number
	offset?: number
}

export interface CampaignResponse {
	id: string
	name: string
	status: CampaignStatus
	subject?: string | null
	smtpSettingsId?: string | null
	contactGroupId?: string | null
	templateId?: string | null
	scheduledAt?: string | null
	createdAt: string
	updatedAt: string
}
