import { Text } from '@consta/uikit/Text'
import { useEffect } from 'react'

import { useGroupManagement } from '../model/useGroupManagement'

import { GroupSelector } from './GroupSelector'
import type { GroupResponseDto } from '@/entities/contacts'

interface ContactGroupsManagerProps {
	contactId: string
	currentGroups: GroupResponseDto[]
	onChange: (groups: GroupResponseDto[]) => void
}

export const ContactGroupsManager: React.FC<ContactGroupsManagerProps> = ({
	contactId,
	currentGroups,
	onChange
}) => {
	const {
		items,
		value,
		onChange: onGroupsChange,
		onInput,
		isLoading,
		searchValue
	} = useGroupManagement({
		contactId,
		initialGroups: currentGroups
	})

	// Синхронизация изменений с родителем
	useEffect(() => {
		if (value) {
			onChange(value)
		}
	}, [value, onChange])

	return (
		<div
			style={{
				backgroundColor: 'var(--color-bg-default)',
				padding: 'var(--space-m)',
				borderRadius: 'var(--control-radius)',
				border: '1px solid var(--color-bg-border)'
			}}
		>
			<Text
				size='m'
				weight='semibold'
				style={{ marginBottom: 'var(--space-s)' }}
			>
				Группы контакта
			</Text>
			<GroupSelector
				items={items}
				value={value}
				onChange={newValue => onGroupsChange(newValue || [])}
				onInput={onInput}
				isLoading={isLoading}
				searchValue={searchValue}
			/>
		</div>
	)
}
