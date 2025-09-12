import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiInstance } from '@/shared/api/api-instance'
import { PUBLIC_ROUTES } from '@/shared/constants'
import { removeSessionToken } from '@/shared/lib/cookie'

export function useApplayAppInterceptor() {
	const navigate = useNavigate()

	useEffect(() => {
		const responseInterceptor = apiInstance.interceptors.response.use(
			response => {
				return response
			},
			error => {
				if (error.response) {
					const status = error.response.status
					switch (status) {
						case 401:
							removeSessionToken()
							navigate(PUBLIC_ROUTES.LOGIN, { replace: true })
							break
						case 403:
							removeSessionToken()
							navigate(PUBLIC_ROUTES.LOGIN, { replace: true })
							break
						case 500:
							removeSessionToken()
							navigate(PUBLIC_ROUTES[500], {
								replace: true,
								state: { legitimateError: true }
							})
							break
						default:
							break
					}
				}
				return Promise.reject(error)
			}
		)

		return () => {
			apiInstance.interceptors.response.eject(responseInterceptor)
		}
	}, [navigate])
}
