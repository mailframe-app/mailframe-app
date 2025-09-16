import { IconLaptopFilled } from '@consta/icons/IconLaptopFilled'
import { IconLock } from '@consta/icons/IconLock'
import { Button } from '@consta/uikit/Button'
import { Tabs } from '@consta/uikit/Tabs'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { useAuth } from '../model/auth-context'

export const MfaForm = () => {
	const {
		methods,
		verifyWithTotp,
		verifyWithRecovery,
		resetMfa,
		isVerifyingTotp,
		isVerifyingRecovery
	} = useAuth()
	const [activeTab, setActiveTab] = useState<'totp' | 'recovery'>(
		methods.includes('totp') ? 'totp' : 'recovery'
	)
	const [totpCode, setTotpCode] = useState('')
	const [recoveryCode, setRecoveryCode] = useState('')

	const mfaTabs = [
		{ label: 'TOTP', value: 'totp', image: IconLaptopFilled },
		{ label: 'Recovery', value: 'recovery', image: IconLock }
	]

	const handleVerifyTotp = async () => {
		if (!totpCode || totpCode.length !== 6 || !/^\d+$/.test(totpCode)) {
			showCustomToast({
				title: 'Ошибка',
				description: 'Код должен содержать 6 цифр',
				type: 'error'
			})
			return
		}

		await verifyWithTotp(totpCode)
	}

	const handleVerifyRecovery = async () => {
		if (!recoveryCode) {
			showCustomToast({
				description: 'Введите код восстановления',
				title: 'Ошибка',
				type: 'error'
			})
			return
		}

		await verifyWithRecovery(recoveryCode)
	}

	return (
		<div className='flex w-full flex-col'>
			<Tabs
				value={mfaTabs.find(tab => tab.value === activeTab)}
				onChange={tab => setActiveTab(tab.value as 'totp' | 'recovery')}
				size='m'
				items={mfaTabs}
				getItemLabel={item => item.label}
				getItemIcon={item => item.image}
				className='mb-4 items-center justify-center'
			/>
			{activeTab === 'totp' && (
				<>
					<Text view='secondary' size='s' className='mb-2'>
						TOTP-код
					</Text>
					<TextField
						type='text'
						placeholder='XXXXXX'
						maxLength={6}
						value={totpCode}
						onClear={() => setTotpCode('')}
						withClearButton
						onChange={v => setTotpCode(v ?? '')}
						className='custom-textfield custom-clear-icon mb-4 w-full'
					/>
					<Button
						label='Подтвердить'
						view='primary'
						size='m'
						width='full'
						onClick={handleVerifyTotp}
						loading={isVerifyingTotp}
					/>
				</>
			)}
			{activeTab === 'recovery' && (
				<>
					<Text view='secondary' size='s' className='mb-2'>
						Код восстановления
					</Text>
					<TextField
						type='text'
						placeholder='XXXXX - XXXXX'
						value={recoveryCode}
						onClear={() => setRecoveryCode('')}
						withClearButton
						onChange={v => setRecoveryCode(v ?? '')}
						className='custom-textfield custom-clear-icon mb-4 w-full'
					/>
					<Button
						label='Подтвердить'
						view='primary'
						size='m'
						width='full'
						onClick={handleVerifyRecovery}
						loading={isVerifyingRecovery}
					/>
				</>
			)}
			<Button
				label='Отмена'
				view='clear'
				size='m'
				onClick={resetMfa}
				className='mt-4 !border !border-[var(--color-control-bg-border-default)]'
			/>
		</div>
	)
}
