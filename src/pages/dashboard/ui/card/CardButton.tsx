import { IconAdd } from '@consta/icons/IconAdd'
import { motion } from 'framer-motion'
import { type FC, memo } from 'react'

import styles from './Card.module.css'

interface CardButtonProps {
	text: string
	isHovered: boolean
	animationDuration?: number
	onClick?: (e: React.MouseEvent) => void
}

/**
 * Компонент для отображения кнопки в карточке
 */
const CardButton: FC<CardButtonProps> = ({
	text,
	isHovered,
	animationDuration = 0.5,
	onClick
}) => {
	return (
		<div style={{ position: 'relative', zIndex: 1 }}>
			<motion.button
				className={`${styles.button} pointer mt-auto ${isHovered ? styles['button-hovered'] : ''}`}
				animate={{
					width: isHovered ? 'auto' : 'auto',
					paddingRight: '12px'
				}}
				transition={{ duration: animationDuration }}
				style={{
					border: !isHovered ? '1px solid var(--color-bg-stripe)' : 'none'
				}}
				onClick={onClick}
			>
				<motion.span
					animate={{
						opacity: isHovered ? 1 : 0,
						width: isHovered ? 'auto' : 0,
						marginRight: isHovered ? '10px' : 0
					}}
					transition={{ duration: animationDuration }}
					style={{ overflow: 'hidden', display: 'inline-block' }}
				>
					{text}
				</motion.span>
				<IconAdd size='s' className='fill-current text-[#4391c5]' />
			</motion.button>
		</div>
	)
}

export default memo(CardButton)
