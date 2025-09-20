import { IconEdit } from '@consta/icons/IconEdit'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'

import { formatDate } from '@/shared/lib/formatDate'

import { useEditableCampaignName } from '../model/useEditableCampaignName'

interface EditableCampaignNameProps {
	campaignId: string
	initialName: string
	updatedAt: string
	onNameUpdate: (newName: string) => void
}

export const EditableCampaignName = ({
	campaignId,
	initialName,
	updatedAt,
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
			<div className='flex flex-col'>
				<div className='flex items-center gap-2'>
					<Text
						as='h1'
						view='primary'
						size='xl'
						weight='semibold'
						className='leading-6'
					>
						{initialName}
					</Text>
					<IconEdit size='s' className='flex-shrink-0' view='primary' />
				</div>
				<Text as='p' view='secondary' size='s' className='!hidden sm:!block'>
					Обновлено: {formatDate(updatedAt)}
				</Text>
			</div>
		</div>
	)
}
