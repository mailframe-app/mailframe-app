import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

interface AuthFormWrapperProps {
	children?: React.ReactNode
	form?: React.ReactNode
	title?: React.ReactNode
	description?: React.ReactNode
}

export function AuthFormWrapper({
	children,
	form,
	title,
	description
}: AuthFormWrapperProps) {
	return (
		<Card
			verticalSpace='3xl'
			horizontalSpace='2xl'
			className='mx-auto w-full max-w-sm !rounded-lg'
			style={{
				backgroundColor: 'var(--color-bg-default)'
			}}
		>
			{title && (
				<Text
					view='primary'
					size='xl'
					weight='bold'
					align='center'
					className='mb-6'
				>
					{title}
				</Text>
			)}
			{description && (
				<Text
					view='secondary'
					size='s'
					weight='regular'
					align='center'
					className='mb-6'
				>
					{description}
				</Text>
			)}
			{form}
			{children}
		</Card>
	)
}
