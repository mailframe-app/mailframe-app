import { DataCell } from '@consta/table/DataCell'
import { Checkbox } from '@consta/uikit/Checkbox'

import { buildHeader } from './buildHeader'

export function SelectCol<T extends { id: string }>({
	allOnPageSelected,
	toggleAllOnPage,
	selectedIds,
	toggleOne
}: {
	allOnPageSelected: boolean
	toggleAllOnPage: () => void
	selectedIds: Set<string>
	toggleOne: (id: string) => void
}) {
	return {
		width: 48,
		minWidth: 48,
		pinned: 'left' as const,
		renderHeaderCell: buildHeader({
			label: (
				<Checkbox
					size='s'
					checked={allOnPageSelected}
					onChange={() => toggleAllOnPage()}
					className='!p-2'
				/>
			)
		}),
		renderCell: ({ row }: { row: T }) => (
			<DataCell
				data-no-row-click
				control={
					<Checkbox
						size='s'
						checked={selectedIds.has(row.id as string)}
						onChange={() => toggleOne(row.id as string)}
					/>
				}
			/>
		)
	}
}
