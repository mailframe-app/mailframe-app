import { motion } from 'framer-motion'
import { type FC, memo } from 'react'

import elipse from '../../assets/elipse.png'

import styles from './Card.module.css'

interface CardElipseProps {
	isHovered: boolean
	animationDuration?: number
}

/**
 * Компонент для отображения элипса в карточке
 */
const CardElipse: FC<CardElipseProps> = ({
	isHovered,
	animationDuration = 0.5
}) => {
	return (
		<motion.img
			src={elipse}
			className={`absolute bottom-0 left-[-1%] z-0 ${styles.elipse}`}
			animate={{
				x: isHovered ? 0 : -200,
				opacity: isHovered ? 1 : 0
			}}
			transition={{
				duration: animationDuration,
				ease: 'easeInOut'
			}}
		/>
	)
}

export default memo(CardElipse)
