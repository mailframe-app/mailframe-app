import { Card } from '@consta/uikit/Card'

import { RemoveAllProvider } from './RemoveAllProvider'
import { SessionItem } from './SessionItem'
import { useSessions } from '@/entities/session'

export function Sessions() {
	const sessions = useSessions()

	return (
		<Card className='w-full !rounded-2xl p-6'>
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
