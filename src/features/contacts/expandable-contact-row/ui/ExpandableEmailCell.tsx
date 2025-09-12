import { IconEdit } from '@consta/icons/IconEdit'
import { DataCell } from '@consta/table/DataCell'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'

import type { ContactListItemDto } from '@/entities/contacts'

interface ExpandableEmailCellProps {
	contact: ContactListItemDto
	email: string
	isExpanded: boolean
	onToggle: (id: string) => void
}

export const ExpandableEmailCell: React.FC<ExpandableEmailCellProps> = ({
	contact,
	email,
	isExpanded,
	onToggle
}) => {
	return (
		<DataCell>
			<div className='flex items-center gap-2'>
				{email ? (
					<a
						href={`mailto:${email}`}
						className='underline'
						style={{
							color: 'var(--color-typo-link)',
							textDecoration: 'none'
						}}
						onMouseEnter={e => {
							e.currentTarget.style.textDecoration = 'underline'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.textDecoration = 'none'
						}}
						onClick={e => e.stopPropagation()}
					>
						<Text size='m'>{email}</Text>
					</a>
				) : (
					<Text size='m' view='ghost'>
						Не указан
					</Text>
				)}
			</div>
			<Button
				size='s'
				view='clear'
				iconLeft={IconEdit}
				iconSize='s'
				onlyIcon
				onClick={e => {
					e.stopPropagation()
					onToggle(contact.id)
				}}
				title={isExpanded ? 'Свернуть' : 'Развернуть'}
				style={{
					minWidth: '24px',
					height: '24px'
				}}
			/>
		</DataCell>
	)
}
