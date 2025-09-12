import {
	SkeletonBrick,
	SkeletonCircle,
	SkeletonText
} from '@consta/uikit/Skeleton'

export type TableSkeletonProps = {
	rows?: number
	columns?: number
	withSelectColumn?: boolean
	className?: string
}

export function TableSkeleton({
	rows = 6,
	columns = 4,
	withSelectColumn = true,
	className
}: TableSkeletonProps) {
	const cols = Math.max(1, columns)
	return (
		<div
			className={[
				'w-full rounded-md border border-[var(--color-bg-border)]',
				className
			]
				.filter(Boolean)
				.join(' ')}
		>
			{/* Header */}
			<div
				className='grid w-full items-center gap-2 border-b border-[var(--color-bg-border)] px-3 py-3'
				style={{
					gridTemplateColumns: `${withSelectColumn ? '40px ' : ''}${Array.from({
						length: cols
					})
						.map(() => '1fr')
						.join(' ')}`
				}}
			>
				{withSelectColumn && (
					<div className='flex items-center justify-center'>
						<SkeletonCircle size={16} />
					</div>
				)}
				{Array.from({ length: cols }).map((_, i) => (
					<div key={`h-${i}`} className='flex items-center gap-2'>
						<SkeletonText rows={1} fontSize='s' />
						{/* <SkeletonBrick width={16} height={16} /> */}
						{/* <SkeletonBrick width={16} height={16} /> */}
					</div>
				))}
			</div>

			{/* Rows */}
			{Array.from({ length: rows }).map((_, r) => (
				<div
					key={`r-${r}`}
					className='grid w-full items-center gap-2 border-b border-[var(--color-bg-border)] px-3 py-3 last:border-b-0'
					style={{
						gridTemplateColumns: `${withSelectColumn ? '40px ' : ''}${Array.from(
							{ length: cols }
						)
							.map(() => '1fr')
							.join(' ')}`
					}}
				>
					{withSelectColumn && (
						<div className='flex items-center justify-center'>
							<SkeletonCircle size={16} />
						</div>
					)}
					{Array.from({ length: cols }).map((_, c) => (
						<div key={`c-${r}-${c}`} className='flex items-center gap-2'>
							<SkeletonBrick height={18} />
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default TableSkeleton
