import { Button } from '@consta/uikit/Button'
import { TextField } from '@consta/uikit/TextField'
import React, { useEffect, useState } from 'react'

import ModalShell from '@/shared/lib/modals/ui/ModalShell'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'

interface RenameTemplateModalProps {
	isOpen: boolean
	onClose: () => void
	isLoading?: boolean
}

export const RenameTemplateModal: React.FC<RenameTemplateModalProps> = ({
	isOpen,
	onClose,
	isLoading = false
}) => {
	const { template, updateName } = useEditorTemplateStore()
	const currentName = template?.name || ''
	const [newName, setNewName] = useState(currentName)

	useEffect(() => {
		if (isOpen) {
			setNewName(currentName)
		}
	}, [isOpen, currentName])

	const handleSave = async () => {
		if (newName.trim()) {
			updateName(newName.trim())
			onClose()
		}
	}

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button label='Отмена' view='ghost' onClick={onClose} disabled={isLoading} />
			<Button
				label='Сохранить'
				onClick={handleSave}
				disabled={!newName.trim() || isLoading}
				loading={isLoading}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Переименовать шаблон'
			containerClassName='w-[400px]'
			footer={footer}
		>
			<TextField
				label='Название шаблона'
				value={newName}
				onChange={value => setNewName(value || '')}
				autoFocus
			/>
		</ModalShell>
	)
}
