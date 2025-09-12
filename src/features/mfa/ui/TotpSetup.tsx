import { IconCopy } from '@consta/icons/IconCopy'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { modals } from '@/shared/lib/modals'
import { showCustomToast } from '@/shared/lib/toaster'

import { useMfa } from '../model/use-mfa'

interface TotpSetupProps {
	onSuccess: () => void
	qrCodeUrl: string
	secret: string
}

export interface TotpSetupHandle {
	verify: () => Promise<boolean>
}

export const TotpSetup = forwardRef<TotpSetupHandle, TotpSetupProps>(
	({ onSuccess, qrCodeUrl, secret }, ref) => {
		const { isLoading, actions } = useMfa()
		const [pin, setPin] = useState('')
		const [copied, setCopied] = useState(false)

		const handleCopySecret = () => {
			if (secret) {
				try {
					// Создаем временный элемент input для копирования текста
					const tempInput = document.createElement('input')
					tempInput.value = secret
					document.body.appendChild(tempInput)
					tempInput.select()
					document.execCommand('copy')
					document.body.removeChild(tempInput)

					setCopied(true)
					showCustomToast({
						title: 'Ключ скопирован',
						type: 'success'
					})
					setTimeout(() => setCopied(false), 1500)
				} catch (error) {
					showCustomToast({
						title: 'Не удалось скопировать ключ',
						type: 'error'
					})
				}
			}
		}

		const handleVerify = async () => {
			if (!pin || pin.length !== 6 || !/^[0-9]{6}$/.test(pin)) {
				showCustomToast({
					title: 'Код должен содержать 6 цифр',
					type: 'error'
				})
				return false
			}
			try {
				await actions.activateTotp(pin, secret)
				showCustomToast({
					title: 'Двухфакторная аутентификация успешно активирована',
					type: 'success'
				})
				modals.closeTop()
				onSuccess()
				return true
			} catch (e) {
				return false
			}
		}

		useImperativeHandle(ref, () => ({
			verify: handleVerify
		}))

		return (
			<div className='flex flex-col'>
				<Text view='secondary' size='s' className='mb-4'>
					При каждом входе в аккаунт, кроме пароля, потребуется одноразовый код
					из приложения-аутентификатора.
				</Text>
				{/* Шаг 1: QR-код и секрет */}
				<div className='mb-2 flex items-center gap-2'>
					<Badge label='Шаг 1' status='system' size='s' />
					<Text weight='bold' view='primary'>
						Отсканируйте QR-код
					</Text>
				</div>
				<Text view='secondary' size='s' className='mb-4'>
					Отсканируйте QR-код ниже или введите секретный ключ вручную в
					приложение-аутентификатор.
				</Text>
				<div className='flex flex-col items-center rounded p-6'>
					{isLoading.generating ? (
						<div
							className='flex items-center justify-center'
							style={{ width: '160px', height: '160px' }}
						>
							<SkeletonBrick width='160px' height='160px' />
						</div>
					) : qrCodeUrl ? (
						<img
							src={qrCodeUrl}
							alt='QR-код для настройки TOTP'
							width={160}
							height={160}
							className='mb-4'
						/>
					) : (
						<Text view='secondary' size='s'>
							QR-код не удалось загрузить
						</Text>
					)}
					<div className='mt-2 w-full'>
						<Text weight='bold' size='s' className='mb-1' view='primary'>
							Проблемы с QR-кодом?
						</Text>
						<Text view='secondary' size='s' className='mb-2' weight='regular'>
							Введите секретный ключ вручную:
						</Text>
						<div className='flex items-center gap-2'>
							<TextField
								value={secret || ''}
								readOnly
								size='s'
								className='flex-grow'
							/>
							<Button
								onlyIcon
								iconLeft={IconCopy}
								view={copied ? 'secondary' : 'clear'}
								onClick={handleCopySecret}
								title='Копировать'
							/>
						</div>
					</div>
				</div>
				{/* Шаг 2: Ввод кода */}
				<div className='mb-2 flex items-center gap-2'>
					<Badge label='Шаг 2' status='system' size='s' />
					<Text weight='bold' view='primary'>
						Верификация кода
					</Text>
				</div>
				<Text view='secondary' size='s' className='mb-2'>
					Введите шестизначный код из приложения.
				</Text>
				<Text weight='bold' size='s' className='mb-2' view='primary'>
					Введите код
				</Text>
				<TextField
					value={pin}
					onChange={value => setPin(value || '')}
					type='text'
					placeholder='XXXXXX'
					size='m'
					maxLength={6}
					className='mb-6 w-full'
				/>
			</div>
		)
	}
)

export function useTotpSetupModal() {
	const openTotpSetupModal = (
		onSuccess: () => void,
		qrCodeUrl: string,
		secret: string
	) => {
		const formRef = React.createRef<TotpSetupHandle>()
		const handleClose = () => modals.closeTop()
		const handleVerify = async () => {
			await formRef.current?.verify()
		}

		modals.openContent({
			title: 'Приложение для аутентификации',
			content: (
				<TotpSetup
					ref={formRef}
					onSuccess={onSuccess}
					qrCodeUrl={qrCodeUrl}
					secret={secret}
				/>
			),
			footer: (
				<div className='grid w-full grid-cols-2 gap-4'>
					<Button
						label='Отмена'
						view='ghost'
						onClick={handleClose}
						width='full'
					/>
					<Button
						label='Продолжить'
						view='primary'
						onClick={handleVerify}
						width='full'
					/>
				</div>
			),
			containerClassName: 'w-[500px] max-w-[92vw]'
		})
	}

	return { openTotpSetupModal }
}
