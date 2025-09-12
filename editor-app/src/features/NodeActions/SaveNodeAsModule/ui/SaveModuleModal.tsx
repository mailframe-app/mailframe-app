import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import React from 'react'

import ModalShell from '@/shared/lib/modals/ui/ModalShell'

import { useSaveModuleModal } from '../model/useSaveModuleModal'

interface SaveModuleModalProps {
	isOpen: boolean
	nodeId: string | null
	onClose: () => void
}

export const SaveModuleModal: React.FC<SaveModuleModalProps> = ({ isOpen, nodeId, onClose }) => {
	const { name, setName, saving, error, tagSelector, handleSave } = useSaveModuleModal({
		isOpen,
		nodeId,
		onClose
	})

	const footer = (
		<div className='flex justify-end gap-2 pt-4'>
			<Button label='Отмена' view='ghost' onClick={onClose} disabled={saving} />
			<Button
				label='Сохранить'
				view='primary'
				onClick={handleSave}
				loading={saving}
				disabled={!name.trim() || saving}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Сохранить модуль'
			containerClassName='w-[512px]'
			footer={footer}
		>
			<div className='flex flex-col space-y-4'>
				<TextField
					label='Название'
					value={name}
					onChange={value => setName(value || '')}
					required
					placeholder='Введите название модуля'
				/>

				<div>
					<Text view='secondary' size='s' className='mb-2'>
						Теги
					</Text>
					<Select
						multiple
						{...tagSelector}
						getItemLabel={(tag: any) => tag.name}
						getItemKey={(tag: any) => tag.id}
						input
						placeholder='Выберите или создайте тег'
						labelForEmptyItems={tagSelector.searchValue ? 'Новый тег' : 'Список тегов пуст'}
					/>
				</div>

				{error && (
					<div className='rounded-md border border-red-400 bg-red-50 p-2 text-sm text-red-800'>
						<Text view='alert'>{error}</Text>
					</div>
				)}
			</div>
		</ModalShell>
	)
}
