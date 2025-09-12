import { Text } from '@consta/uikit/Text'

import { useProfile } from '@/entities/profile'

export function GreetingHeader() {
	const currentUser = useProfile()

	return (
		<>
			<Text as='h1' view='primary' size='3xl' weight='bold' className='mb-4'>
				Добро пожаловать{currentUser && `, ${currentUser.displayName}!`}
			</Text>
			<Text as='p' view='secondary' size='m' weight='regular' className='mb-8'>
				Всё, что нужно для быстрой и эффективной внутренней и внешней
				коммуникации.
			</Text>
		</>
	)
}
