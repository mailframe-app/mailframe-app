import { IconEdit } from '@consta/icons/IconEdit'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'

import { useEditableTemplateName } from '../model/useEditableTemplateName'

interface EditableTemplateNameProps {
	templateId: string
	initialName: string
	onNameUpdate: (newName: string) => void
}

export const EditableTemplateName = ({
	templateId,
	initialName,
	onNameUpdate
}: EditableTemplateNameProps) => {
	const {
		isEditing,
		localName,
		setLocalName,
		handleNameSubmit,
		handleKeyDown,
		startEditing
	} = useEditableTemplateName({ templateId, initialName, onNameUpdate })

	if (isEditing) {
		return (
			<TextField
				value={localName}
				onChange={v => setLocalName(v || '')}
				onBlur={handleNameSubmit}
				onKeyDown={handleKeyDown}
				size='m'
				autoFocus
				className='w-full'
			/>
		)
	}

	return (
		<div
			className='flex min-w-0 cursor-pointer items-center gap-2'
			onClick={startEditing}
		>
			<Text
				size='xl'
				weight='bold'
				as='h3'
				view='primary'
				className='overflow-hidden text-ellipsis whitespace-nowrap'
			>
				{initialName}
			</Text>
			<IconEdit size='s' className='flex-shrink-0 text-gray-500' />
		</div>
	)
}
