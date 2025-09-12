const SkeletonCard = () => (
	<div className='animate-pulse'>
		<div className='mb-2 h-[120px] rounded bg-gray-200'></div>
		<div className='mb-1 h-4 w-3/4 rounded bg-gray-200'></div>
		<div className='h-3 w-1/2 rounded bg-gray-200'></div>
	</div>
)

export const StorageModalSkeleton = () => {
	return (
		<div className='p-8'>
			<div className='flex flex-wrap'>
				{Array.from({ length: 12 }).map((_, index) => (
					<div key={index} className='mb-6 px-3' style={{ width: '16.666%', minWidth: '180px' }}>
						<SkeletonCard />
					</div>
				))}
			</div>
		</div>
	)
}
