import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

import { useTheme } from '@/features/theme'

import { BaseLogo } from './BaseLogo'

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
	const { theme } = useTheme()

	return (
		<>
			<Card
				verticalSpace='3xl'
				horizontalSpace='3xl'
				shadow={false}
				className='flex w-full flex-col items-center !rounded-2xl sm:max-w-md'
				style={{
					backgroundColor: 'var(--color-bg-default)'
				}}
			>
				<BaseLogo size='xs' className='mb-6' />
				{title && (
					<Text
						view='primary'
						size='xl'
						weight='semibold'
						align='center'
						className={`${theme === 'presetGpnDefault' ? 'TextGradientLight' : 'TextGradientDark'}`}
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
						className='mt-2 mb-6'
					>
						{description}
					</Text>
				)}
				{form}
				{children}
			</Card>
			<Text
				view='secondary'
				size='s'
				className='mt-3 w-full text-center sm:max-w-md'
			>
				Входя в систему, вы соглашаетесь с{' '}
				<span className='underline'>условиями использования</span> и{' '}
				<span className='underline'>политикой конфиденциальности</span>.
			</Text>
			<Text
				view='secondary'
				size='s'
				className='mt-2 w-full text-center sm:max-w-md'
			>
				Mailframe © 2025
			</Text>
		</>
	)
}
