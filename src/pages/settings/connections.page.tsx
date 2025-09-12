import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'

import { Connections } from '@/features/social-auth'

function ConnectionsPage() {
	return (
		<Layout direction='column' flex={1}>
			<Card
				verticalSpace='2xl'
				horizontalSpace='2xl'
				className='flex h-full w-full flex-col !rounded-2xl'
			>
				<Text size='2xl' weight='bold' view='primary' className='mb-8'>
					Подключение сторонних сервисов
				</Text>
				<Connections />
			</Card>
		</Layout>
	)
}

export const Component = ConnectionsPage
