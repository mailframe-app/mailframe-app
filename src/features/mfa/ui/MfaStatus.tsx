import { IconLock } from '@consta/icons/IconLock'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { useQueryClient } from '@tanstack/react-query'

import { useMfa } from '../model/use-mfa'

import { useDisableTotpModal } from './DisableTotp'
import { RecoveryCodesCard } from './RecoveryCodes'
import { useTotpSetupModal } from './TotpSetup'

export const MfaStatus = () => {
	const queryClient = useQueryClient()
	const { mfaStatus, actions, isLoading } = useMfa()
	const { openTotpSetupModal } = useTotpSetupModal()
	const { openDisableTotpModal } = useDisableTotpModal()

	const handleSetupClick = async () => {
		try {
			const result = await actions.generateSecret()
			if (result && result.qrCodeUrl && result.secret) {
				openTotpSetupModal(
					() => {
						queryClient.invalidateQueries({ queryKey: ['mfa'] })
					},
					result.qrCodeUrl,
					result.secret
				)
			}
		} catch (error) {
			console.error('Ошибка при генерации секрета:', error)
		}
	}

	const handleDisableClick = () => {
		openDisableTotpModal(() => {
			queryClient.invalidateQueries({ queryKey: ['mfa'] })
		})
	}

	return (
		<div className='flex flex-col gap-4'>
			<Card
				verticalSpace='xl'
				horizontalSpace='xl'
				className='w-full !rounded-xl'
			>
				<div className='flex items-center justify-between'>
					<div className='flex items-center'>
						<div
							className='mr-4 rounded-full px-3 py-2'
							style={{
								backgroundColor: 'var(--color-control-bg-primary)'
							}}
						>
							<IconLock size='m' className='text-white' />
						</div>
						<div>
							<div className='mb-1 flex items-center'>
								<Text weight='bold' view='primary' className='mr-2'>
									Приложение для аутентификации
								</Text>
								<Badge
									label={mfaStatus?.totpMfa ? 'Включено' : 'Отключено'}
									status={mfaStatus?.totpMfa ? 'success' : 'system'}
									size='s'
									view='tinted'
								/>
							</div>
							<Text view='secondary' size='xs'>
								{mfaStatus?.totpMfa
									? 'Двухфакторная аутентификация через TOTP включена. Для входа в аккаунт используйте приложение-аутентификатор, чтобы получить код.'
									: 'Обеспечьте безопасность своего аккаунта с помощью двухфакторной аутентификации через TOTP.'}
							</Text>
						</div>
					</div>

					{mfaStatus?.totpMfa ? (
						<Button
							label='Отключить'
							view='secondary'
							onClick={handleDisableClick}
						/>
					) : (
						<Button
							label='Включить'
							view='secondary'
							loading={isLoading.generating}
							onClick={handleSetupClick}
						/>
					)}
				</div>
			</Card>

			{mfaStatus?.recoveryActive && <RecoveryCodesCard />}
		</div>
	)
}
