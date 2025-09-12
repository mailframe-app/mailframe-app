import { IconAlert } from '@consta/icons/IconAlert'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { modals } from '@/shared/lib/modals'

export const ConnectionError: React.FC = () => {
	const [searchParams] = useSearchParams()

	useEffect(() => {
		const error = searchParams.get('error')

		if (error === 'already-linked') {
			showErrorModal({
				title: 'Аккаунт уже привязан',
				description: 'Этот аккаунт уже привязан к другому пользователю.',
				details:
					'Пожалуйста, используйте другой аккаунт или свяжитесь с поддержкой по адресу support@mailframe.ru, чтобы решить эту проблему.'
			})
		} else if (error === 'email-taken') {
			showErrorModal({
				title: 'Почта уже используется',
				description: 'Указанная почта уже используется другим аккаунтом.',
				details:
					'Попробуйте использовать другой адрес электронной почты или восстановить доступ к старому аккаунту.'
			})
		}
	}, [searchParams])

	const showErrorModal = ({
		title,
		description,
		details
	}: {
		title: string
		description: string
		details: string
	}) => {
		modals.openContent({
			title: (
				<div className='flex items-center gap-2'>
					<IconAlert size='m' view='warning' />
					{title}
				</div>
			),
			description: description,
			content: (
				<div
					style={{
						backgroundColor: 'var(--color-bg-secondary)',
						padding: 'var(--space-m)',
						borderRadius: 'var(--control-radius)'
					}}
					className='mb-4'
				>
					{details}
				</div>
			),
			containerClassName: 'w-[480px] max-w-[92vw]'
		})
	}

	return null
}
