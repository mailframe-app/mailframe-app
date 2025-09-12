import { Button } from '@consta/uikit/Button'
import { Responses500 } from '@consta/uikit/Responses500'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PUBLIC_ROUTES } from '@/shared/constants'

function Page500() {
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (!location.state?.legitimateError) {
			navigate(PUBLIC_ROUTES.LOGIN, { replace: true })
		}
	}, [location.state, navigate])

	return (
		<div className='flex h-screen w-full items-center justify-center'>
			<Responses500
				size='l'
				actions={[
					<Button
						key='button'
						size='m'
						view='primary'
						label='Перейти на главную'
						form='round'
						onClick={() => navigate(PUBLIC_ROUTES.LOGIN)}
					/>
				]}
			/>
		</div>
	)
}
export const Component = Page500
