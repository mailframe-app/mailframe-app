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
				verticalSpace='l'
				horizontalSpace='l'
				className='w-full !rounded-lg border border-[var(--color-bg-ghost)]'
				shadow={false}
			>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-x-6'>
						<div
							className='flex aspect-square h-12 w-12 items-center justify-center rounded-full'
							style={{
								backgroundColor: 'var(--color-control-bg-primary)'
							}}
						>
							<IconLock size='m' className='text-white' />
						</div>
						<div>
							<div className='mb-1 flex items-center'>
								<Text weight='bold' view='primary' as='h2' className='mr-2'>
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
							className='!border !border-[var(--color-bg-alert)] !text-[var(--color-bg-alert)]'
							onClick={handleDisableClick}
						/>
					) : (
						<Button
							label='Включить'
							view='clear'
							className='!border !border-[var(--color-bg-ghost)]'
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
