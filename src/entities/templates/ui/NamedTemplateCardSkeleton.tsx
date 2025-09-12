import { Card } from '@consta/uikit/Card'

export function NamedTemplateCardSkeleton() {
	return (
		<Card
			shadow={false}
			border
			className='flex h-full animate-pulse flex-col !rounded-lg'
			style={{ backgroundColor: 'var(--color-bg-secondary)' }}
		>
			<div className='flex-grow p-2'>
				<div
					className='h-64 w-full rounded-md'
					style={{ backgroundColor: 'var(--color-bg-default)' }}
				/>
			</div>
			<div className='p-4' style={{ background: 'var(--color-bg-default)' }}>
				<div
					className='mx-auto h-6 w-3/4 rounded'
					style={{ backgroundColor: 'var(--color-bg-secondary)' }}
				/>
			</div>
		</Card>
	)
}
