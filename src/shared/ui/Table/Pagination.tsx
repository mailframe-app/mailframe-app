import { Pagination } from '@consta/table/Pagination'
import { Text } from '@consta/uikit/Text'

export type TablePaginationProps = {
	total: number
	offset: number
	step: number
	onChange: (offset: number) => void
	onStepChange: (step: number) => void
}

export function TablePagination({
	total,
	offset,
	step,
	onChange,
	onStepChange
}: TablePaginationProps) {
	return (
		<div className='mt-4 flex items-center justify-between'>
			<Text size='s' view='secondary'>
				Всего: {total}
			</Text>
			<div className='flex items-center gap-2'>
				<Pagination
					total={total}
					offset={offset}
					step={step}
					onChange={(newOffset: number) => {
						onChange(newOffset)
					}}
					onStepChange={(newStep: number) => {
						onStepChange(newStep)
					}}
				/>
			</div>
		</div>
	)
}
