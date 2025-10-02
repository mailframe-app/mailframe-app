import { IconEdit } from '@consta/icons/IconEdit'
import { TextField } from '@consta/uikit/TextField'

import { useEditableTitle } from '../model/useEditableTitle'

export const EditableTitle = () => {
	const {
		isEditing,
		localName,
		templateName,
		setLocalName,
		handleNameSubmit,
		handleKeyDown,
		startEditing
	} = useEditableTitle()

	if (isEditing) {
		return (
			<TextField
				value={localName}
				onChange={v => setLocalName(v || '')}
				onBlur={handleNameSubmit}
				onKeyDown={handleKeyDown}
				size='s'
				autoFocus
				className='min-w-[228px] text-xl font-medium'
			/>
		)
	}

	return (
		<div className='flex min-w-0 items-center gap-2'>
			<h2
				className='text-inter min-w-[228px] overflow-hidden text-[24px] font-bold whitespace-nowrap text-[var(--color-typo-primary)]'
				onClick={startEditing}
				style={{ cursor: 'pointer' }}
			>
				{templateName}
			</h2>
			<IconEdit
				size='s'
				className='cursor-pointer text-[var(--color-typo-primary)] hover:text-blue-600'
				onClick={startEditing}
			/>
		</div>
	)
}
