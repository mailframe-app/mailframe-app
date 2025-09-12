import { IconClose } from '@consta/icons/IconClose'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'

import ModalShell from '@/shared/lib/modals/ui/ModalShell'

import { useSendTestEmail } from '../model/useSendTestEmail'

interface SendTestEmailModalProps {
	isOpen: boolean
	onClose: () => void
}

export const SendTestEmailModal: React.FC<SendTestEmailModalProps> = ({ isOpen, onClose }) => {
	const { sendEmail, isLoading, resetState } = useSendTestEmail()
	const [variables, setVariables] = useState([{ key: '', value: '' }])

	const handleAddVariable = () => {
		setVariables([...variables, { key: '', value: '' }])
	}

	const handleRemoveVariable = (index: number) => {
		const newVariables = variables.filter((_, i) => i !== index)
		setVariables(newVariables)
	}

	const handleVariableChange = (index: number, field: 'key' | 'value', value: string) => {
		const newVariables = [...variables]
		newVariables[index][field] = value
		setVariables(newVariables)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const recipientEmail = formData.get('email') as string
		const subject = formData.get('subject') as string

		const testVariables = variables.reduce(
			(acc, { key, value }) => {
				if (key) {
					acc[key] = value
				}
				return acc
			},
			{} as Record<string, string>
		)

		if (recipientEmail) {
			await sendEmail({
				recipientEmail,
				subject,
				testVariables
			})
			onClose()
		}
	}

	const handleClose = () => {
		resetState()
		setVariables([{ key: '', value: '' }])
		onClose()
	}

	const formId = 'send-test-email-form'

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button label='Отмена' view='ghost' onClick={handleClose} disabled={isLoading} />
			<Button
				label='Отправить'
				view='primary'
				loading={isLoading}
				onClick={() => {
					document
						.getElementById(formId)
						?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
				}}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={handleClose}
			title='Отправить тестовое письмо'
			containerClassName='w-[500px]'
			footer={footer}
		>
			<Layout as='form' id={formId} onSubmit={handleSubmit} direction='column'>
				<div className='mb-4'>
					<label htmlFor='email-input' className='mb-1 block text-sm font-medium text-gray-700'>
						Email получателя
					</label>
					<input
						type='email'
						name='email'
						id='email-input'
						required
						className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
						placeholder='test@example.com'
					/>
				</div>
				<div className='mb-4'>
					<label htmlFor='subject-input' className='mb-1 block text-sm font-medium text-gray-700'>
						Тема письма
					</label>
					<input
						type='text'
						name='subject'
						id='subject-input'
						className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
						placeholder='Тестовая тема'
					/>
				</div>

				<div className='mb-4'>
					<Text as='p' size='m' view='primary' weight='bold' className='mb-2'>
						Тестовые переменные
					</Text>
					<div className='space-y-2'>
						{variables.map((variable, index) => (
							<div key={index} className='flex items-center gap-2'>
								<input
									type='text'
									value={variable.key}
									onChange={e => handleVariableChange(index, 'key', e.target.value)}
									className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
									placeholder='{{variableName}}'
								/>
								<input
									type='text'
									value={variable.value}
									onChange={e => handleVariableChange(index, 'value', e.target.value)}
									className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none'
									placeholder='Value'
								/>
								<Button
									type='button'
									iconLeft={IconClose}
									view='ghost'
									size='s'
									onClick={() => handleRemoveVariable(index)}
								/>
							</div>
						))}
					</div>
					<Button
						type='button'
						label='Добавить переменную'
						view='ghost'
						onClick={handleAddVariable}
						className='mt-2'
					/>
				</div>
			</Layout>
		</ModalShell>
	)
}
