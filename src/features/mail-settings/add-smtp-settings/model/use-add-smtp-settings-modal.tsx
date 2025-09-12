import { Button } from '@consta/uikit/Button'
import { useRef } from 'react'

import { modals } from '@/shared/lib/modals'

import {
	AddSmtpSettingsForm,
	type AddSmtpSettingsFormHandle
} from '../ui/AddSmtpSettingsForm'

import { useSmtpSettings } from '@/entities/mail-settings'

export function useAddSmtpSettingsModal() {
	const formRef = useRef<AddSmtpSettingsFormHandle>(null)
	const { createSmtpSettings, testSmtpSettings, isCreating, isTesting } =
		useSmtpSettings()

	const openAddSmtpSettingsModal = () => {
		const handleClose = () => modals.closeTop()
		const handleSave = () => {
			formRef.current?.submitForm()
		}

		const handleTest = async () => {
			const values = formRef.current?.getValues()
			if (values) {
				const { smtpPort, ...rest } = values
				const parsedPort =
					typeof smtpPort === 'string' ? parseInt(smtpPort, 10) : smtpPort

				if (typeof parsedPort === 'number' && !isNaN(parsedPort)) {
					await testSmtpSettings({
						testSettings: { ...rest, smtpPort: parsedPort }
					})
				}
			}
		}

		modals.openContent({
			title: 'Добавить SMTP-настройки',
			content: (
				<AddSmtpSettingsForm
					ref={formRef}
					onSuccess={handleClose}
					createSmtpSettings={createSmtpSettings}
				/>
			),
			footer: (
				<div className='flex w-full justify-between gap-4'>
					<Button
						label='Тестировать'
						view='ghost'
						onClick={handleTest}
						loading={isTesting}
					/>
					<div className='flex gap-4'>
						<Button
							label='Отмена'
							view='ghost'
							onClick={handleClose}
							disabled={isCreating}
						/>
						<Button
							label='Сохранить'
							view='primary'
							onClick={handleSave}
							loading={isCreating}
						/>
					</div>
				</div>
			),
			containerClassName: 'w-[55vw] max-w-[92vw]'
		})
	}

	return {
		openAddSmtpSettingsModal
	}
}
