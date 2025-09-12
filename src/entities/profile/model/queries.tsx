import {
	type UseQueryOptions,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'

import { getSessionToken } from '@/shared/lib/cookie'
import { showCustomToast } from '@/shared/lib/toaster'

import {
	Profile,
	updateProfileInfo,
	updateProfileOnboarding,
	updateProfileTheme,
	uploadAvatar
} from '../api'
import type {
	ProfileResponse,
	UpdateOnboardingRequest,
	UpdateProfileRequest,
	UpdateThemeRequest
} from '../api/types'

const profileQueryKey = 'profile'

export const profileQuery = () =>
	({
		queryKey: [profileQueryKey, 'currentProfile'],
		queryFn: () => Profile(),
		enabled: !!getSessionToken()
	}) satisfies UseQueryOptions

export const useInvalidateProfile = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			queryKey: [profileQueryKey, 'currentProfile']
		})
	}
}

export const useUpdateProfileInfoMutation = () => {
	const invalidateProfile = useInvalidateProfile()
	return useMutation({
		mutationFn: (data: UpdateProfileRequest) => updateProfileInfo(data),
		onSuccess: () => {
			showCustomToast({
				title: 'Профиль успешно обновлен',
				type: 'success'
			})
			invalidateProfile()
		},
		onError: (error: any) => {
			showCustomToast({
				title: error?.message || 'Ошибка при сохранении профиля',
				type: 'error'
			})
		}
	})
}

export const useUpdateProfileThemeMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: UpdateThemeRequest) => updateProfileTheme(data),
		onMutate: async (newThemeData: UpdateThemeRequest) => {
			await queryClient.cancelQueries({
				queryKey: [profileQueryKey, 'currentProfile']
			})
			const previousProfile = queryClient.getQueryData<ProfileResponse>([
				profileQueryKey,
				'currentProfile'
			])
			queryClient.setQueryData<ProfileResponse>(
				[profileQueryKey, 'currentProfile'],
				(old: ProfileResponse | undefined) => {
					if (!old) return undefined
					return {
						...old,
						theme: newThemeData.theme
					}
				}
			)
			return { previousProfile }
		},
		onError: (_err, _newThemeData, context) => {
			if (context?.previousProfile) {
				queryClient.setQueryData<ProfileResponse>(
					[profileQueryKey, 'currentProfile'],
					context.previousProfile
				)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [profileQueryKey, 'currentProfile']
			})
		}
	})
}

export const useUpdateProfileOnboardingMutation = () => {
	return useMutation({
		mutationFn: (data: UpdateOnboardingRequest) =>
			updateProfileOnboarding(data),
		onSuccess: useInvalidateProfile()
	})
}

export const useUploadAvatarMutation = () => {
	const invalidateProfile = useInvalidateProfile()

	return useMutation({
		mutationFn: (file: File) => uploadAvatar(file),
		onSuccess: () => {
			showCustomToast({
				title: 'Изображение профиля успешно обновлено',
				type: 'success'
			})
			invalidateProfile()
		},
		onError: (error: any) => {
			showCustomToast({
				title: error?.message || 'Ошибка при загрузке аватара',
				type: 'error'
			})
		}
	})
}
