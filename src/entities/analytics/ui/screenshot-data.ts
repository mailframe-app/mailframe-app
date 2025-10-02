import {
	type GetSummaryResponse,
	type GetTimeseriesResponse,
	type TimeseriesMetric
} from '../api/types'

// Mock данные для сводки
export const screenshotSummaryData: GetSummaryResponse = {
	period: {
		from: '2024-01-01T00:00:00.000Z',
		to: '2024-12-31T23:59:59.999Z'
	},
	totals: {
		recipients: 42500,
		sent: 39875,
		failed: 2625,
		opens: 9570,
		clicks: 1914,
		unsubs: 160,
		campaigns: 24,
		contactsTotal: 29850,
		campaignsTotal: 114
	},
	rates: {
		deliveryRate: 93.8,
		openRate: 24.0,
		ctr: 20.0,
		clickToOpen: 20.0,
		unsubRate: 0.4,
		failRate: 6.2
	}
}

// Mock данные для таймсерий
export const screenshotTimeseriesData: Record<
	TimeseriesMetric,
	GetTimeseriesResponse
> = {
	sent: {
		metric: 'sent',
		bucket: 'day',
		points: [
			{ t: '2025-09-24T00:00:00.000Z', value: 4200 },
			{ t: '2025-09-25T00:00:00.000Z', value: 3950 },
			{ t: '2025-09-26T00:00:00.000Z', value: 4400 },
			{ t: '2025-09-27T00:00:00.000Z', value: 4700 },
			{ t: '2025-09-28T00:00:00.000Z', value: 4600 },
			{ t: '2025-09-29T00:00:00.000Z', value: 4300 },
			{ t: '2025-09-30T00:00:00.000Z', value: 4550 },
			{ t: '2025-10-01T00:00:00.000Z', value: 4750 }
		]
	},
	opened: {
		metric: 'opened',
		bucket: 'day',
		points: [
			{ t: '2025-09-24T00:00:00.000Z', value: 1008 },
			{ t: '2025-09-25T00:00:00.000Z', value: 948 },
			{ t: '2025-09-26T00:00:00.000Z', value: 1056 },
			{ t: '2025-09-27T00:00:00.000Z', value: 1128 },
			{ t: '2025-09-28T00:00:00.000Z', value: 1104 },
			{ t: '2025-09-29T00:00:00.000Z', value: 1032 },
			{ t: '2025-09-30T00:00:00.000Z', value: 1092 },
			{ t: '2025-10-01T00:00:00.000Z', value: 1140 }
		]
	},
	clicked: {
		metric: 'clicked',
		bucket: 'day',
		points: [
			{ t: '2025-09-24T00:00:00.000Z', value: 202 },
			{ t: '2025-09-25T00:00:00.000Z', value: 190 },
			{ t: '2025-09-26T00:00:00.000Z', value: 211 },
			{ t: '2025-09-27T00:00:00.000Z', value: 226 },
			{ t: '2025-09-28T00:00:00.000Z', value: 221 },
			{ t: '2025-09-29T00:00:00.000Z', value: 206 },
			{ t: '2025-09-30T00:00:00.000Z', value: 218 },
			{ t: '2025-10-01T00:00:00.000Z', value: 228 }
		]
	}
}

// Флаг для переключения между реальными и mock данными
export const USE_MOCK_DATA = false
