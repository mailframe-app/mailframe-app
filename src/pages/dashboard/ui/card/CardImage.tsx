import { motion } from 'framer-motion'
import { type FC, memo } from 'react'

import styles from './Card.module.css'

interface CardImageProps {
	imageUrl: string
	position: 'image-top' | 'image-bottom'
	isHovered: boolean
	animationDuration?: number
	className?: string
}

/**
 * Компонент для отображения изображения в карточке
 */
const CardImage: FC<CardImageProps> = ({
	imageUrl,
	position,
	isHovered,
	animationDuration = 0.5,
	className
}) => {
	return (
		<motion.img
			className={`absolute right-0 bottom-0 z-0 h-[180px] w-[200px] ${position === 'image-bottom' ? '!h-[150px] !w-[140px]' : ''} ${styles[position]} ${className || ''}`}
			src={imageUrl}
			animate={{
				opacity: isHovered ? 1 : 0.1,
				scale: isHovered
					? position === 'image-top'
						? 1.4
						: position === 'image-bottom'
							? 1.2
							: 1
					: 1
			}}
			transition={{
				duration: animationDuration,
				ease: 'easeInOut'
			}}
		/>
	)
}

export default memo(CardImage)
