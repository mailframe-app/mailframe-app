import { IconEdit } from '@consta/icons/IconEdit'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'

import { useEditableCampaignName } from '../model/useEditableCampaignName'

interface EditableCampaignNameProps {
	campaignId: string
	initialName: string
	onNameUpdate: (newName: string) => void
}

export const EditableCampaignName = ({
	campaignId,
	initialName,
	onNameUpdate
}: EditableCampaignNameProps) => {
	const {
		isEditing,
		localName,
		setLocalName,
		handleNameSubmit,
		handleKeyDown,
		startEditing
	} = useEditableCampaignName({ campaignId, initialName, onNameUpdate })

	if (isEditing) {
		return (
			<TextField
				value={localName}
				onChange={v => setLocalName(v || '')}
				onBlur={handleNameSubmit}
				onKeyDown={handleKeyDown}
				size='m'
				autoFocus
				className='w-full max-w-md'
			/>
		)
	}

	return (
		<div
			className='flex min-w-0 cursor-pointer items-center gap-4'
			onClick={startEditing}
		>
			<Text
				size='3xl'
				weight='bold'
				as='h1'
				view='primary'
				className='overflow-hidden text-ellipsis whitespace-nowrap'
			>
				{initialName}
			</Text>
			<IconEdit size='s' className='flex-shrink-0' view='primary' />
		</div>
	)
}
