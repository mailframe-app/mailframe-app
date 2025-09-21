import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { motion } from 'framer-motion'
import { type FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@/features/theme'

import type { CardLinkProps } from '../../types'

import styles from './Card.module.css'
import CardButton from './CardButton'
import CardElipse from './CardElipse'
import CardImage from './CardImage'
import CardText from './CardText'

const CardLink: FC<CardLinkProps> = ({
	isHovered,
	onHover,
	text,
	title,
	description,
	imageUrl,
	position,
	url,
	className,
	onButtonClick
}) => {
	const { theme } = useTheme()
	const navigate = useNavigate()
	const animationDuration = 0.5

	const handleCardClick = useCallback(() => {
		navigate(url as any)
	}, [navigate, url])

	const handleButtonClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			if (onButtonClick) {
				onButtonClick()
			} else {
				navigate(url as any)
			}
		},
		[navigate, onButtonClick, url]
	)

	return (
		<motion.div
			animate={{
				minWidth: isHovered ? '38%' : '30%'
			}}
			transition={{
				duration: animationDuration,
				ease: 'easeInOut'
			}}
		>
			<Card
				verticalSpace='m'
				horizontalSpace='m'
				className={`relative flex max-h-[14rem] min-w-[24%] cursor-pointer flex-col overflow-hidden !rounded-lg transition-all duration-300 ease-in ${isHovered ? 'hovered !bg-[#4391c5]' : ''} ${styles.cardContainer} ${className}`}
				onMouseEnter={onHover}
				onClick={handleCardClick}
				shadow={false}
				style={{
					background: 'var(--color-bg-default)'
				}}
			>
				<Layout
					direction='column'
					className='h-full items-start justify-between'
				>
					<CardText
						title={title}
						description={description}
						isHovered={isHovered}
						theme={theme}
						animationDuration={animationDuration}
					/>
					<CardButton
						text={text}
						isHovered={isHovered}
						animationDuration={animationDuration}
						onClick={handleButtonClick}
					/>
					<CardImage
						imageUrl={imageUrl}
						position={position}
						isHovered={isHovered}
						animationDuration={animationDuration}
					/>
				</Layout>
				<CardElipse
					isHovered={isHovered}
					animationDuration={animationDuration}
				/>
			</Card>
		</motion.div>
	)
}
export { CardLink }
