import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'

import { Connections } from '@/features/social-auth'

function ConnectionsPage() {
	return (
		<Layout direction='column'>
			<Card
				verticalSpace='l'
				horizontalSpace='l'
				className='flex flex-col !rounded-lg bg-[var(--color-bg-default)]'
				shadow={false}
			>
				<Text as='h2' view='primary' size='l' weight='semibold'>
					Подключение сторонних сервисов
				</Text>
				<Text view='secondary' size='s' weight='regular'>
					Подключите и управляйте своими аккаунтами с использованием сторонних
					сервисов
				</Text>
				<Connections />
			</Card>
		</Layout>
	)
}

export const Component = ConnectionsPage
