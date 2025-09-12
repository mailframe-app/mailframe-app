import type { IconComponent } from '@consta/icons/Icon'
import type { BadgePropStatus } from '@consta/uikit/Badge'

import type { CalendarEventType, CampaignStatus } from '../api'

export type UIStatus =
	| 'Черновик'
	| 'В очереди'
	| 'Запланирована'
	| 'Отправляется'
	| 'Отправлена'
	| 'Отменена'

export const StatusConfig: Record<
	UIStatus,
	{
		label: string
		status: BadgePropStatus
		icon: IconComponent | string
	}
> = {
	Черновик: {
		label: 'Черновик',
		status: 'system',
		icon: 'IconEdit'
	},
	'В очереди': {
		label: 'В очереди',
		status: 'system',
		icon: 'IconArrowRedone'
	},
	Запланирована: {
		label: 'Отложенная',
		status: 'warning',
		icon: 'IconArrowRedone'
	},
	Отправляется: {
		label: 'Отправляется',
		status: 'system',
		icon: 'IconArrowRedone'
	},
	Отправлена: {
		label: 'Завершенная',
		status: 'success',
		icon: 'IconAllDone'
	},
	Отменена: {
		label: 'Отменённая',
		status: 'error',
		icon: 'IconTrash'
	}
}

export const mapCampaignStatus = (status: CampaignStatus): UIStatus => {
	switch (status) {
		case 'DRAFT':
			return 'Черновик'
		case 'QUEUED':
			return 'В очереди'
		case 'SCHEDULED':
			return 'Запланирована'
		case 'SENDING':
			return 'Отправляется'
		case 'SENT':
			return 'Отправлена'
		case 'CANCELED':
			return 'Отменена'
		default:
			return 'Черновик'
	}
}

export const mapEventTypeToUIStatus = (
	eventType: CalendarEventType
): UIStatus => {
	switch (eventType) {
		case 'draft':
			return 'Черновик'
		case 'queued':
			return 'В очереди'
		case 'scheduled':
			return 'Запланирована'
		case 'sending':
			return 'Отправляется'
		case 'sent':
			return 'Отправлена'
		case 'canceled':
			return 'Отменена'
		default:
			return 'Черновик'
	}
}
