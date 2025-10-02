import { Text } from '@consta/uikit/Text'

import { useProfile } from '@/entities/profile'

export function GreetingHeader() {
	const currentUser = useProfile()

	return (
		<div className='mb-7 flex flex-col'>
			<Text as='h1' view='primary' size='xl'>
				Добро пожаловать
				{currentUser && (
					<>
						,{' '}
						<Text as='span' weight='semibold'>
							{currentUser.displayName}
						</Text>
						!
					</>
				)}
			</Text>
			<Text as='p' view='secondary' size='s'>
				Всё, что нужно для быстрой и эффективной внутренней и внешней
				коммуникации.
			</Text>
		</div>
	)
}
