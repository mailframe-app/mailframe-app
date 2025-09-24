import { Card } from '@consta/uikit/Card'

import { useSessions } from '@/entities/session'
import { RemoveAllProvider } from './RemoveAllProvider'
import { SessionItem } from './SessionItem'

export function Sessions() {
	const sessions = useSessions()

	return (
		<Card shadow={false} verticalSpace='l' horizontalSpace='l' className='w-full !rounded-lg p-6 border border-[var(--color-bg-ghost)]'>
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
