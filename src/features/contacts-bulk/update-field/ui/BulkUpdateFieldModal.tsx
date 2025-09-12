import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'
import ModalShell from '@/shared/ui/Modals/ModalShell'

import { useBulkUpdateFieldMutation } from '@/entities/contacts'

export type FieldItem = { key: string; name: string }

export type BulkUpdateFieldModalProps = {
	isOpen: boolean
	onClose: () => void
	contactIds: string[]
	fields: FieldItem[]
	onSuccess?: () => void
}

export function BulkUpdateFieldModal({
	isOpen,
	onClose,
	contactIds,
	fields,
	onSuccess
}: BulkUpdateFieldModalProps) {
	const [selectedField, setSelectedField] = useState<FieldItem | null>(null)
	const [value, setValue] = useState('')
	const mutation = useBulkUpdateFieldMutation()

	const options = useMemo(() => fields, [fields])

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
				label='Обновить'
				disabled={!selectedField || value.length === 0 || mutation.isPending}
				loading={mutation.isPending}
				onClick={() => {
					mutation.mutate(
						{
							contactIds,
							fieldKey: selectedField?.key as string,
							value
						} as any,
						{
							onSuccess: () => {
								showCustomToast({
									title: 'Контакты обновлены',
									type: 'success'
								})
								onSuccess?.()
								onClose()
								setSelectedField(null)
								setValue('')
							},
							onError: (e: any) =>
								showCustomToast({
									title: e?.message || 'Ошибка обновления контактов',
									type: 'error'
								})
						}
					)
				}}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Обновить выбранные контакты'
			description={
				<Text size='s' view='secondary'>
					Выбрано контактов: {contactIds.length}
				</Text>
			}
			footer={footer}
		>
			<div className='grid grid-cols-1 gap-3'>
				<div>
					<Text size='s' view='secondary' className='mb-1'>
						Поле для обновления
					</Text>
					<Select
						items={options}
						getItemLabel={(i: FieldItem) => i.name}
						getItemKey={(i: FieldItem) => i.key}
						value={selectedField}
						onChange={setSelectedField as any}
						placeholder='Выберите поле для обновления'
						size='s'
					/>
				</div>
				<div>
					<Text size='s' view='secondary' className='mb-1'>
						Значение для обновления
					</Text>
					<TextField
						size='m'
						value={value}
						onChange={v => setValue((v as string) || '')}
					/>
				</div>
			</div>
		</ModalShell>
	)
}

export default BulkUpdateFieldModal
