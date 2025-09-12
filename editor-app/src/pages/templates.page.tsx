import { IconArrowRight } from '@consta/icons/IconArrowRight'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { useEffect } from 'react'

import { CONFIG } from '@/shared/lib/envConfig'

export const TemplatesPage = () => {
	const redirectToMainApp = () => {
		window.location.href = CONFIG.MAIN_APP_URL + '/templates'
	}

	useEffect(() => {
		if (CONFIG.MAIN_APP_URL && window.location.origin !== CONFIG.MAIN_APP_URL) {
			redirectToMainApp()
		}
	}, [])

	return (
		<div className='flex h-screen flex-col items-center justify-center gap-5 text-center'>
			<Text as='h1' size='2xl' weight='bold'>
				Страница с шаблонами
			</Text>
			<Text size='l'>
				Эта страница доступна только в режиме разработки для предпросмотра и отладки шаблонов.
			</Text>
			<Button
				label='Перейти в основное приложение'
				iconRight={IconArrowRight}
				onClick={redirectToMainApp}
			/>
		</div>
	)
}
