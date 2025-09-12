import { apiInstance, handleApiError } from '@/shared/api'

import type {
	CampaignResponse,
	CreateCampaignRequest,
	ListCampaignsQuery,
	ListCampaignsResponse,
	UpdateCampaignRequest
} from './types'

// POST /v1/campaigns
export const createCampaign = async (
	payload?: CreateCampaignRequest
): Promise<CampaignResponse> => {
	try {
		const { data } = await apiInstance.post<CampaignResponse>(
			'/v1/campaigns',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/campaigns
export const listCampaigns = async (
	params?: ListCampaignsQuery
): Promise<ListCampaignsResponse> => {
	try {
		let queryString = ''
		if (params) {
			const searchParams = new URLSearchParams()
			for (const key in params) {
				if (Object.prototype.hasOwnProperty.call(params, key)) {
					const value = params[key as keyof ListCampaignsQuery]
					if (Array.isArray(value)) {
						value.forEach(v => {
							if (v !== undefined && v !== null) {
								searchParams.append(key, v)
							}
						})
					} else if (value !== undefined && value !== null && value !== '') {
						searchParams.set(key, String(value))
					}
				}
			}
			queryString = searchParams.toString()
		}

		const url = `/v1/campaigns${queryString ? `?${queryString}` : ''}`
		const { data } = await apiInstance.get<ListCampaignsResponse>(url)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/campaigns/{id}
export const getCampaign = async (id: string): Promise<CampaignResponse> => {
	try {
		const { data } = await apiInstance.get<CampaignResponse>(
			`/v1/campaigns/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /v1/campaigns/{id}
export const updateCampaign = async (
	id: string,
	payload: UpdateCampaignRequest
): Promise<CampaignResponse> => {
	try {
		const { data } = await apiInstance.patch<CampaignResponse>(
			`/v1/campaigns/${id}`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /v1/campaigns/{id}
export const deleteCampaign = async (id: string): Promise<void> => {
	try {
		await apiInstance.delete<void>(`/v1/campaigns/${id}`)
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
