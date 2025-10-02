import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { type FC, memo } from 'react'

import styles from './Card.module.css'

interface CardTextProps {
	title: string
	description: string
	isHovered: boolean
	theme?: string
	animationDuration?: number
}

/**
 * Компонент для отображения текстового содержимого в карточке
 */
const CardText: FC<CardTextProps> = ({
	title,
	description,
	isHovered,
	theme,
	animationDuration = 0.5
}) => {
	return (
		<Layout direction='column' className='mb-6 items-start'>
			<Text
				as='h2'
				size='xl'
				weight='bold'
				align='center'
				className='mb-2'
				style={{
					color:
						isHovered ||
						theme === 'presetGpnDark' ||
						theme === 'presetGpnDisplay'
							? 'white'
							: '',
					transition: `color ${animationDuration}s ease`
				}}
			>
				{title}
			</Text>
			<Text
				className={`z-1 mb-auto ${!isHovered ? styles['ellipsis-text'] : styles['full-text']}`}
				view='primary'
				as='h4'
				size='s'
				weight='regular'
				align='center'
				style={{
					color: isHovered ? 'white' : '',
					textAlign: 'left',
					transition: `color ${animationDuration}s ease`
				}}
			>
				{description}
			</Text>
		</Layout>
	)
}

export default memo(CardText)
