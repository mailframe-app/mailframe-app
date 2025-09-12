import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import React from 'react'

import type { Module } from '../../model/types'
import { useEditModuleForm } from '../model/useEditModuleForm'

interface EditModuleFormProps {
	module: Module
	onClose: () => void
}

export const EditModuleForm: React.FC<EditModuleFormProps> = ({ module, onClose }) => {
	const { name, setName, tagSelector, handleSave } = useEditModuleForm({ module, onClose })

	return (
		<div className='flex flex-col space-y-4'>
			<TextField
				label='Название'
				value={name}
				onChange={value => setName(value || '')}
				className='mb-2'
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

			<div className='flex justify-end gap-2 pt-4'>
				<Button label='Отмена' view='ghost' onClick={onClose} />
				<Button label='Сохранить' view='primary' onClick={handleSave} />
			</div>
		</div>
	)
}
