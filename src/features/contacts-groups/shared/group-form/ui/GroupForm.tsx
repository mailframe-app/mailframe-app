import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useState } from 'react'

import ModalShell from '@/shared/ui/Modals/ModalShell'

import { GroupFormSchema, type GroupFormValues } from '../model/schema'

export type GroupFormProps = {
	isOpen: boolean
	onClose: () => void
	initial?: Partial<GroupFormValues>
	isSubmitting?: boolean
	submitLabel?: string
	title?: string
	description?: string
	onSubmit: (values: GroupFormValues) => void
}

export default function GroupForm({
	isOpen,
	onClose,
	initial,
	isSubmitting,
	submitLabel = 'Сохранить',
	title,
	description,
	onSubmit
}: GroupFormProps) {
	const [name, setName] = useState(initial?.name ?? '')
	const [groupDescription, setGroupDescription] = useState(
		initial?.description ?? ''
	)
	const [error, setError] = useState<string>('')

	useEffect(() => {
		setName(initial?.name ?? '')
		setGroupDescription(initial?.description ?? '')
	}, [initial?.name, initial?.description])

	const handleSubmit = () => {
		const parsed = GroupFormSchema.safeParse({
			name,
			description: groupDescription
		})
		if (!parsed.success) {
			const first = parsed.error.issues[0]
			setError(first?.message || 'Проверьте поля формы')
			return
		}
		setError('')
		onSubmit(parsed.data)
	}

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button view='secondary' label='Отмена' onClick={onClose} />
			<Button
				view='primary'
				label={submitLabel}
				onClick={handleSubmit}
				disabled={isSubmitting || !name.trim()}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			description={description}
			footer={footer}
		>
			<div className='grid grid-cols-1 gap-4'>
				<div>
					<TextField
						label='Название'
						value={name}
						onChange={v => setName((v as string) || '')}
						size='m'
						autoFocus
					/>
				</div>
				<div>
					<TextField
						type='textarea'
						rows={4}
						label='Описание'
						value={groupDescription}
						onChange={v => setGroupDescription((v as string) || '')}
						size='m'
						placeholder='Описание группы'
					/>
				</div>
				{error ? (
					<Text size='s' view='alert'>
						{error}
					</Text>
				) : null}
			</div>
		</ModalShell>
	)
}
