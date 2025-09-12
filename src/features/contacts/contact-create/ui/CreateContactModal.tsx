import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useState } from 'react'

import { modals } from '@/shared/lib/modals'
import { showCustomToast } from '@/shared/lib/toaster'
import ModalShell from '@/shared/ui/Modals/ModalShell'

import type { CreateContactDto } from '@/entities/contacts/api/types'
import { useCreateContactMutation } from '@/entities/contacts/model'

function CreateContactForm({ onClose }: { onClose: () => void }) {
	const [email, setEmail] = useState<string>('')
	const mutation = useCreateContactMutation()

	async function handleCreate() {
		const payload: CreateContactDto = { email }
		try {
			await mutation.mutateAsync(payload)
			showCustomToast({ title: 'Контакт создан', type: 'success' })
			onClose()
		} catch (e: any) {
			showCustomToast({
				title: e?.message || 'Не удалось создать контакт',
				type: 'error'
			})
		}
	}

	return (
		<ModalShell
			isOpen
			onClose={onClose}
			title='Создание контакта'
			footer={
				<div className='flex w-full justify-end gap-2'>
					<Button view='ghost' label='Отмена' onClick={onClose} />
					<Button
						view='primary'
						label='Создать'
						onClick={handleCreate}
						disabled={!email || mutation.isPending}
					/>
				</div>
			}
		>
			<div className='flex flex-col gap-3'>
				<Text size='s' view='secondary'>
					Введите email контакта. Остальные поля можно заполнить позже.
				</Text>
				<TextField
					placeholder='email@example.com'
					value={email}
					onChange={v => setEmail((v as string) || '')}
				/>
			</div>
		</ModalShell>
	)
}
export function openCreateContactModal() {
	modals.openRender(({ close }) => <CreateContactForm onClose={close} />)
}
