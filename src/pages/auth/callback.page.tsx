import { Loader } from '@consta/uikit/Loader'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiInstance } from '@/shared/api'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/shared/constants'
import { setSessionToken } from '@/shared/lib/cookie'

function AuthCallbackPage() {
	const navigate = useNavigate()

	useEffect(() => {
		const hash = window.location.hash
		const token = new URLSearchParams(hash.slice(1)).get('token')

		if (token) {
			setSessionToken(token)
			apiInstance.defaults.headers['X-Session-Token'] = token
			navigate(PRIVATE_ROUTES.DASHBOARD)
		} else {
			navigate(PUBLIC_ROUTES.LOGIN)
		}
	}, [navigate])

	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<Loader size='m' view='primary' />
		</div>
	)
}
export const Component = AuthCallbackPage
