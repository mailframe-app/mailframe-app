import { useMutation, useQueryClient } from '@tanstack/react-query'

import { showCustomToast } from '@/shared/lib'

import {
	cancelCampaign,
	createCampaign,
	deleteCampaign,
	reopenCampaign,
	retryFailed,
	scheduleCampaign,
	startCampaign,
	updateCampaign
} from '../../api'
import type {
	ActionSuccessResponse,
	CampaignResponse,
	CreateCampaignRequest,
	RetryFailedResponse,
	ScheduleCampaignRequest,
	UpdateCampaignRequest
} from '../../api/types'
import { campaignsKeys } from '../queryKeys'

export function useCreateCampaignMutation() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload?: CreateCampaignRequest) => createCampaign(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
		}
	})
}

export function useUpdateCampaignMutation() {
	const queryClient = useQueryClient()
	return useMutation<
		CampaignResponse,
		unknown,
		{ id: string; payload: UpdateCampaignRequest }
	>({
		mutationFn: ({ id, payload }) => updateCampaign(id, payload),
		onSuccess: (updatedCampaign, { id }) => {
			queryClient.setQueryData(campaignsKeys.detail(id), updatedCampaign)
			queryClient.invalidateQueries({ queryKey: campaignsKeys.list() })
		}
	})
}

export function useStartCampaignMutation() {
	const queryClient = useQueryClient()
	return useMutation<ActionSuccessResponse, unknown, { id: string }>({
		mutationFn: ({ id }) => startCampaign(id),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
			queryClient.refetchQueries({ queryKey: campaignsKeys.detail(id) })
		}
	})
}

export function useScheduleCampaignMutation() {
	const queryClient = useQueryClient()
	return useMutation<
		ActionSuccessResponse,
		unknown,
		{ id: string; payload: ScheduleCampaignRequest }
	>({
		mutationFn: ({ id, payload }) => scheduleCampaign(id, payload),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
			queryClient.refetchQueries({ queryKey: campaignsKeys.detail(id) })
		}
	})
}

export function useRetryFailedMutation() {
	const queryClient = useQueryClient()
	return useMutation<RetryFailedResponse, unknown, { id: string }>({
		mutationFn: ({ id }) => retryFailed(id),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
			queryClient.refetchQueries({ queryKey: campaignsKeys.detail(id) })
		}
	})
}

export function useCancelCampaignMutation() {
	const queryClient = useQueryClient()
	return useMutation<ActionSuccessResponse, unknown, { id: string }>({
		mutationFn: ({ id }) => cancelCampaign(id),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
			queryClient.refetchQueries({ queryKey: campaignsKeys.detail(id) })
		}
	})
}

export function useReopenCampaignMutation() {
	const queryClient = useQueryClient()
	return useMutation<ActionSuccessResponse, unknown, { id: string }>({
		mutationFn: ({ id }) => reopenCampaign(id),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
			queryClient.refetchQueries({ queryKey: campaignsKeys.detail(id) })
		}
	})
}

export function useDeleteCampaignMutation() {
	const queryClient = useQueryClient()
	return useMutation<void, unknown, { id: string; name: string }>({
		mutationFn: ({ id }) => deleteCampaign(id),
		onSuccess: async (_, { name }) => {
			showCustomToast({
				description: `Рассылка "${name}" успешно удалена`,
				title: `Успешно`,
				type: 'success'
			})
			await queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
		}
	})
}
