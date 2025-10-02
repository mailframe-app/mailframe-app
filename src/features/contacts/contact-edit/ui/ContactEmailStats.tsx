import { Text } from '@consta/uikit/Text'

import { useContactEmailStats } from '@/entities/contacts'

interface ContactEmailStatsProps {
	contactId: string
}

export const ContactEmailStats: React.FC<ContactEmailStatsProps> = ({
	contactId
}) => {
	const { data: stats, isLoading, isError } = useContactEmailStats(contactId)

	if (isLoading) {
		return (
			<div
				style={{
					backgroundColor: 'var(--color-bg-default)',
					padding: 'var(--space-m)',
					borderRadius: 'var(--control-radius)',
					border: '1px solid var(--color-bg-border)'
				}}
			>
				<Text
					size='m'
					weight='semibold'
					style={{ marginBottom: 'var(--space-s)' }}
				>
					Статистика
				</Text>
				<Text size='s' view='secondary'>
					Загрузка...
				</Text>
			</div>
		)
	}

	if (isError || !stats) {
		return (
			<div
				style={{
					backgroundColor: 'var(--color-bg-default)',
					padding: 'var(--space-m)',
					borderRadius: 'var(--control-radius)',
					border: '1px solid var(--color-bg-border)'
				}}
			>
				<Text
					size='m'
					weight='semibold'
					style={{ marginBottom: 'var(--space-s)' }}
				>
					Статистика
				</Text>
				<Text size='s' view='secondary'>
					Нет данных
				</Text>
			</div>
		)
	}

	return (
		<div
			style={{
				backgroundColor: 'var(--color-bg-default)',
				padding: 'var(--space-m)',
				borderRadius: 'var(--control-radius)',
				border: '1px solid var(--color-bg-border)'
			}}
		>
			<Text
				size='m'
				weight='semibold'
				style={{ marginBottom: 'var(--space-m)' }}
			>
				Статистика
			</Text>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--space-s)'
				}}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Text size='s' view='secondary'>
						Отправлено:
					</Text>
					<Text size='s' weight='semibold'>
						{stats.sentCount}
					</Text>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Text size='s' view='secondary'>
						Открыто:
					</Text>
					<Text size='s' weight='semibold'>
						{stats.openedCount}
					</Text>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Text size='s' view='secondary'>
						Клики:
					</Text>
					<Text size='s' weight='semibold'>
						{stats.clickedCount}
					</Text>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Text size='s' view='secondary'>
						Ошибки:
					</Text>
					<Text size='s' weight='semibold'>
						{stats.failedCount}
					</Text>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Text size='s' view='secondary'>
						Кампании:
					</Text>
					<Text size='s' weight='semibold'>
						{stats.campaignsCount}
					</Text>
				</div>

				{stats.lastOpenedAt && (
					<div style={{ marginTop: 'var(--space-s)' }}>
						<Text size='xs' view='secondary'>
							Последнее открытие:{' '}
							{new Date(stats.lastOpenedAt).toLocaleDateString()}
						</Text>
					</div>
				)}
			</div>
		</div>
	)
}
