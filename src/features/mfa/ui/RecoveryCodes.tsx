import { IconAlert } from '@consta/icons/IconAlert'
import { IconListNumbered } from '@consta/icons/IconListNumbered'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { SkeletonText } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'

import { modals } from '@/shared/lib/modals'

import { getRecoveryCodes } from '../api'
import { useMfa } from '../model/use-mfa'

export const RecoveryCodesContent = () => {
	const { actions, isLoading: mfaIsLoading } = useMfa()
	const { data: codes, isLoading } = useQuery<string[]>({
		queryKey: ['mfa', 'recovery-codes'],
		queryFn: getRecoveryCodes
	})

	const handleRegenerate = () => {
		actions.regenerateCodes()
	}

	const handleDownload = () => {
		if (!codes || codes.length === 0) {
			return
		}

		const blob = new Blob([codes.join('\n')], {
			type: 'text/plain'
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'recovery-codes.txt'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	return (
		<div className='flex flex-col'>
			<Text view='secondary' size='s' className='mb-4'>
				Эти коды помогут вам получить доступ к учетной записи, если вы потеряете
				доступ к устройству и не сможете получать коды двухфакторной
				аутентификации.
			</Text>

			<div
				className='mb-4 flex items-start gap-3 rounded p-3'
				style={{
					background: '#FFF8E1',
					border: '1px solid #FFD600'
				}}
			>
				<IconAlert size='m' style={{ color: '#FFB300', marginTop: 2 }} />
				<div>
					<Text size='s' weight='bold' style={{ color: '#B28704' }}>
						Пожалуйста, храните их в безопасном месте.
					</Text>
					<Text size='s' style={{ color: '#B28704' }}>
						Они — последний способ восстановления доступа к учетной записи.
					</Text>
				</div>
			</div>

			<div
				className='my-4 grid grid-cols-3 gap-2 rounded p-4'
				style={{
					backgroundColor: 'var(--color-bg-secondary)'
				}}
			>
				{isLoading || mfaIsLoading.regenerating ? (
					<>
						{Array.from({ length: 12 }).map((_, index) => (
							<div key={index} className='text-center'>
								<SkeletonText rows={1} />
							</div>
						))}
					</>
				) : codes && codes.length > 0 ? (
					codes.map((code, index) => (
						<div key={index} className='text-center font-mono text-base'>
							<Text size='s' weight='bold' view='primary'>
								{code}
							</Text>
						</div>
					))
				) : (
					<Text view='secondary' size='s' className='col-span-3 text-center'>
						Коды восстановления не найдены
					</Text>
				)}
			</div>

			<div className='mt-4 flex justify-end gap-2'>
				<Button
					label='Сбросить'
					view='secondary'
					onClick={handleRegenerate}
					loading={mfaIsLoading.regenerating}
					disabled={isLoading}
				/>
				<Button
					label='Скачать'
					view='primary'
					onClick={handleDownload}
					disabled={
						!codes ||
						codes.length === 0 ||
						isLoading ||
						mfaIsLoading.regenerating
					}
				/>
			</div>
		</div>
	)
}

export const RecoveryCodesCard = () => {
	const { isLoading } = useMfa()
	const { openRecoveryCodesModal } = useRecoveryCodesModal()

	return (
		<Card
			verticalSpace='xl'
			horizontalSpace='xl'
			className='mt-2 w-full !rounded-xl'
		>
			<div className='flex items-center justify-between'>
				<div className='flex items-center'>
					<div
						className='mr-4 rounded-full px-3 py-2'
						style={{
							backgroundColor: 'var(--color-control-bg-primary)'
						}}
					>
						<IconListNumbered size='m' className='text-white' />
					</div>
					<div>
						<div className='mb-1 flex items-center'>
							<Text weight='bold' view='primary' className='mr-2'>
								Коды восстановления
							</Text>
						</div>
						<Text view='secondary' size='xs'>
							Вы можете использовать коды восстановления для доступа к аккаунту,
							если потеряете доступ к своему устройству.
						</Text>
					</div>
				</div>
				<Button
					label='Просмотреть'
					view='secondary'
					onClick={openRecoveryCodesModal}
					loading={isLoading.regenerating}
				/>
			</div>
		</Card>
	)
}

export function useRecoveryCodesModal() {
	const openRecoveryCodesModal = () => {
		modals.openContent({
			title: 'Коды восстановления',
			closeButton: false,
			content: <RecoveryCodesContent />,
			containerClassName: 'w-[520px] max-w-[92vw]'
		})
	}

	return { openRecoveryCodesModal }
}
