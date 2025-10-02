import { Card } from '@consta/uikit/Card'

import { RemoveAllProvider } from './RemoveAllProvider'
import { SessionItem } from './SessionItem'
import { useSessions } from '@/entities/session'

export function Sessions() {
	const sessions = useSessions()

	return (
		<Card
			shadow={false}
			verticalSpace='l'
			horizontalSpace='l'
			className='w-full !rounded-lg border border-[var(--color-bg-ghost)] p-6'
		>
			{sessions.map((session, index) => (
				<SessionItem
					key={session.id}
					session={session}
					isCurrentSession={index === 0}
					actions={index === 0 ? <RemoveAllProvider /> : null}
				/>
			))}
		</Card>
	)
}
