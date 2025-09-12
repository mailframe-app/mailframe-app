export interface ContactEmailStatsDto {
	contactId: string
	sentCount: number
	failedCount: number
	openedCount: number
	clickedCount: number
	unsubscribed: boolean
	firstSentAt: string | null
	lastSentAt: string | null
	lastOpenedAt: string | null
	lastClickedAt: string | null
	campaignsCount: number
}

export interface EmailLogCampaignDto {
	id: string
	name: string
	subject: string
}

export interface EmailLogItemDto {
	id: string
	status: 'PENDING' | 'SENT' | 'FAILED'
	errorMessage: string | null
	sentAt: string | null
	openedAt: string | null
	clickedAt: string | null
	campaign: EmailLogCampaignDto
}

export interface GetEmailLogsQueryDto {
	page?: number
	limit?: number
}

export interface GetEmailLogsResponseDto {
	page: number
	limit: number
	total: number
	items: EmailLogItemDto[]
}
