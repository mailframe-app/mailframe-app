import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'
import ModalShell from '@/shared/ui/Modals/ModalShell'

import { ContactStatus, useUpdateContactMutation } from '@/entities/contacts'

export type EditContactModalProps = {
	isOpen: boolean
	onClose: () => void
	contactId: string | null
	initial: {
		email: string
		status: ContactStatus
		fields: Record<string, string>
	}
	visibleFields?: { key: string; name: string }[]
	onUpdated?: () => void
}

export function EditContactModal({
	isOpen,
	onClose,
	contactId,
	initial,
	visibleFields,
	onUpdated
}: EditContactModalProps) {
	const [email, setEmail] = useState(initial.email)
	const [status, setStatus] = useState<ContactStatus>(initial.status)
	const [fields, setFields] = useState<Record<string, string>>(initial.fields)
	useEffect(() => {
		setEmail(initial.email)
		setStatus(initial.status)
		setFields(initial.fields)
	}, [initial])

	const mutation = useUpdateContactMutation()

	const fieldsToRender = useMemo(() => {
		if (visibleFields && visibleFields.length > 0) return visibleFields
		return Object.keys(fields).map(k => ({ key: k, name: k }))
	}, [visibleFields, fields])

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button
				view='ghost'
				label='Отмена'
				onClick={onClose}
				disabled={mutation.isPending}
			/>
			<Button
				view='primary'
				label='Сохранить'
				loading={mutation.isPending}
				onClick={() => {
					if (!contactId) return
					const payload = {
						email,
						status,
						fields: Object.entries(fields)
							.filter(([, v]) => typeof v === 'string')
							.map(([fieldKey, value]) => ({ fieldKey, value }))
					}
					mutation.mutate({ id: contactId, payload } as any, {
						onSuccess: () => {
							showCustomToast({
								title: 'Контакт обновлён',
								type: 'success'
							})
							onUpdated?.()
							onClose()
						},
						onError: (e: any) =>
							showCustomToast({
								title: 'Ошибка обновления контакта',
								description: e?.message || 'Не удалось обновить контакт',
								type: 'error'
							})
					})
				}}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Редактировать контакт'
			footer={footer}
		>
			<div className='grid grid-cols-1 gap-3'>
				<div>
					<Text size='s' view='secondary' className='mb-1'>
						Email
					</Text>
					<TextField
						size='m'
						value={email}
						onChange={v => setEmail((v as string) || '')}
					/>
				</div>
				<div>
					<Text size='s' view='secondary' className='mb-1'>
						Статус
					</Text>
					<select
						className='w-full rounded border border-gray-300 p-2'
						value={status}
						onChange={e =>
							setStatus(e.target.value as unknown as ContactStatus)
						}
					>
						{Object.keys(ContactStatus).map(k => (
							<option key={k} value={(ContactStatus as any)[k]}>
								{k}
							</option>
						))}
					</select>
				</div>
				{fieldsToRender.map(({ key, name }) => (
					<div key={key}>
						<Text size='s' view='secondary' className='mb-1'>
							{name}
						</Text>
						<TextField
							size='m'
							value={fields[key] || ''}
							onChange={v =>
								setFields(prev => ({
									...prev,
									[key]: (v as string) || ''
								}))
							}
						/>
					</div>
				))}
			</div>
		</ModalShell>
	)
}

export default EditContactModal
