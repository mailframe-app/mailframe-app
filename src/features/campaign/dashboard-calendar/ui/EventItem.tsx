import { Badge } from '@consta/uikit/Badge'
import { Text } from '@consta/uikit/Text'

import {
	type CalendarEventItem,
	StatusConfig,
	mapEventTypeToUIStatus
} from '@/entities/campaigns'

interface EventItemProps {
	event: CalendarEventItem
}

export function EventItem({ event }: EventItemProps) {
	const uiStatus = mapEventTypeToUIStatus(event.eventType)
	const { status, label } = StatusConfig[uiStatus]

	return (
		<div className='flex items-center py-2'>
			{/* Цветная полоска слева */}
			<div
				className='mr-3 h-10 w-1 flex-shrink-0 rounded-sm'
				style={{ backgroundColor: `var(--color-bg-${status})` }}
			/>

			{/* Контент */}
			<div className='mr-3 min-w-0 flex-grow'>
				<div className='mb-1 flex items-center'>
					<Text size='s' weight='medium' className='truncate' view='primary'>
						{event.title}
					</Text>
				</div>
				<Text size='xs' view='secondary'>
					{new Date(event.at).toLocaleTimeString('ru-RU', {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</Text>
			</div>

			{/* Бейдж справа */}
			<Badge status={status} label={label} size='s' />
		</div>
	)
}
