import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'
import ModalShell from '@/shared/ui/Modals/ModalShell'

import { useBulkRemoveFromGroupsMutation } from '@/entities/contacts'

export type BulkRemoveFromGroupsModalProps = {
	isOpen: boolean
	onClose: () => void
	contactIds: string[]
	groups: { id: string; name: string }[]
	onSuccess?: () => void
}

export function BulkRemoveFromGroupsModal({
	isOpen,
	onClose,
	contactIds,
	groups,
	onSuccess
}: BulkRemoveFromGroupsModalProps) {
	const [searchValue, setSearchValue] = useState('')
	const [selectedGroups, setSelectedGroups] = useState<
		{ id: string; name: string }[]
	>([])
	const mutation = useBulkRemoveFromGroupsMutation()

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
				label='Исключить'
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
									title: 'Контакты исключены из групп',
									description: `Исключено из ${selectedGroups.length} групп`,
									type: 'success'
								})
								onSuccess?.()
								onClose()
								setSelectedGroups([])
								setSearchValue('')
							},
							onError: (e: any) => {
								showCustomToast({
									title: 'Ошибка исключения из групп',
									description:
										e?.message || 'Не удалось исключить контакты из групп',
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
			title='Исключить из групп'
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
						Выберите группы для исключения контактов:
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

export default BulkRemoveFromGroupsModal
