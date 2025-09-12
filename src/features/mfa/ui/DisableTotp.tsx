import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { modals } from '@/shared/lib/modals'
import { showCustomToast } from '@/shared/lib/toaster'

import { useMfa } from '../model/use-mfa'

interface DisableTotpProps {
	onSuccess: () => void
}

export interface DisableTotpHandle {
	disable: () => Promise<boolean>
}

export const DisableTotp = forwardRef<DisableTotpHandle, DisableTotpProps>(
	({ onSuccess }, ref) => {
		const { actions } = useMfa()
		const [password, setPassword] = useState('')

		const handleDisable = async () => {
			if (!password) {
				showCustomToast({
					title: 'Введите пароль для подтверждения',
					type: 'error'
				})
				return false
			}

			try {
				await actions.deactivateTotp(password)
				onSuccess()
				modals.closeTop()
				return true
			} catch (e) {
				return false
			}
		}

		useImperativeHandle(ref, () => ({
			disable: handleDisable
		}))

		return (
			<div className='flex flex-col'>
				<Text view='secondary' size='s' className='mb-6'>
					Для отключения двухфакторной аутентификации необходимо подтвердить ваш
					пароль. После отключения для входа в аккаунт будет требоваться только
					пароль.
				</Text>

				<Text weight='bold' size='s' className='mb-2' view='primary'>
					Пароль
				</Text>

				<TextField
					value={password}
					onChange={value => setPassword(value || '')}
					type='password'
					placeholder='Введите ваш пароль'
					size='m'
					className='mb-6 w-full'
				/>
			</div>
		)
	}
)

export function useDisableTotpModal() {
	const openDisableTotpModal = (onSuccess: () => void) => {
		const formRef = React.createRef<DisableTotpHandle>()
		const handleClose = () => modals.closeTop()
		const handleDisable = async () => {
			const success = await formRef.current?.disable()
			if (success) {
				onSuccess()
			}
		}

		modals.openContent({
			title: 'Отключение двухфакторной аутентификации',
			closeButton: false,
			content: <DisableTotp ref={formRef} onSuccess={onSuccess} />,
			footer: (
				<div className='grid w-full grid-cols-2 gap-4'>
					<Button
						label='Отмена'
						view='ghost'
						onClick={handleClose}
						width='full'
					/>
					<Button
						label='Отключить'
						view='primary'
						onClick={handleDisable}
						width='full'
					/>
				</div>
			),
			containerClassName: 'w-[480px] max-w-[92vw]'
		})
	}

	return { openDisableTotpModal }
}
