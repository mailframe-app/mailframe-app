import { Select } from '@consta/uikit/Select'
import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'

import { GroupSelector, useGroupManagement } from '../manage-groups'
import type { ImportOptionsState } from '../ui/ImportWizard'

import { useGroups } from '@/entities/contacts/model'

type Props = {
	options: ImportOptionsState
	onChange: (o: ImportOptionsState) => void
}

const GROUP_MODE_LABELS: Record<
	NonNullable<ImportOptionsState['groupMode']>,
	string
> = {
	add: 'Добавить контакты в группу',
	replace: 'Заменить группы у контактов'
}

const groupModeItems = Object.entries(GROUP_MODE_LABELS).map(
	([value, label]) => ({
		label,
		value: value as NonNullable<ImportOptionsState['groupMode']>
	})
)

function OptionsStep({ options, onChange }: Props) {
	const { data: allGroupsData } = useGroups()

	const currentGroup = useMemo(() => {
		return allGroupsData?.items.find(g => g.id === options.groupId) || null
	}, [allGroupsData, options.groupId])

	const handleGroupChange = (group: { id: string } | null) => {
		onChange({
			...options,
			groupId: group?.id || undefined
		})
	}

	const groupSelectorProps = useGroupManagement({
		value: currentGroup,
		onChange: handleGroupChange as any
	})

	return (
		<div className='flex flex-col gap-4'>
			<Text size='l' weight='bold' className='mb-4' view='primary'>
				Выберите группу
			</Text>
			<GroupSelector {...groupSelectorProps} />

			{options.groupId && (
				<div
					className='mt-4 rounded border p-3'
					style={{
						borderColor: 'var(--color-bg-border)'
					}}
				>
					<Text view='secondary' size='s' className='mb-2'>
						Режим добавления в группу
					</Text>
					<Select
						value={groupModeItems.find(i => i.value === options.groupMode)}
						items={groupModeItems}
						getItemKey={item => item.value}
						getItemLabel={item => item.label}
						onChange={v =>
							onChange({
								...options,
								groupMode: v?.value as any
							})
						}
					/>
				</div>
			)}
		</div>
	)
}

export default OptionsStep
