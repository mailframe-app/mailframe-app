import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'
import ModalShell from '@/shared/ui/Modals/ModalShell'

import { useBulkAddToGroupsMutation } from '@/entities/contacts'

export type BulkAddToGroupsModalProps = {
	isOpen: boolean
	onClose: () => void
	contactIds: string[]
	groups: { id: string; name: string }[]
	onSuccess?: () => void
}

export function BulkAddToGroupsModal({
	isOpen,
	onClose,
	contactIds,
	groups,
	onSuccess
}: BulkAddToGroupsModalProps) {
	const [searchValue, setSearchValue] = useState('')
	const [selectedGroups, setSelectedGroups] = useState<
		{ id: string; name: string }[]
	>([])
	const mutation = useBulkAddToGroupsMutation()

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
				label='Добавить'
				disabled={selectedGroups.length === 0 || mutation.isPending}
				loading={mutation.isPending}
				onClick={() => {
					mutation.mutate(
						{
							contactIds,
							groupIds: selectedGroups.map(g => g.id)
						} as any,
						{
							onSuccess: () => {
								showCustomToast({
									title: 'Контакты добавлены в группы',
									description: `Добавлено в ${selectedGroups.length} групп`,
									type: 'success'
								})
								onSuccess?.()
								onClose()
								setSelectedGroups([])
								setSearchValue('')
							},
							onError: (e: any) => {
								showCustomToast({
									title: 'Ошибка добавления в группы',
									description:
										e?.message || 'Не удалось добавить контакты в группы',
									type: 'error'
								})
							}
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
			title='Добавить в группы'
			description={
				<Text size='s' view='secondary'>
					Выбрано контактов: {contactIds.length}
				</Text>
			}
			footer={footer}
		>
			<div className='space-y-4'>
				<div>
					<Text size='s' view='secondary' className='mb-2'>
						Выберите группы для добавления контактов:
					</Text>
					<Select
						multiple
						items={groups}
						value={selectedGroups}
						onChange={value => setSelectedGroups(value || [])}
						getItemLabel={group => group.name}
						getItemKey={group => group.id}
						input
						onInput={setSearchValue}
						placeholder='Выберите группы'
						labelForEmptyItems={
							searchValue ? 'Группы не найдены' : 'Список групп пуст'
						}
					/>
				</div>
			</div>
		</ModalShell>
	)
}

export default BulkAddToGroupsModal
