import { IconAdd } from '@consta/icons/IconAdd'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { motion } from 'framer-motion'
import { type FC } from 'react'
import { Link } from 'react-router-dom'

import { useTheme } from '@/features/theme'

import { PRIVATE_ROUTES } from '@/shared/constants'

import elipse from '../assets/elipse.png'

import styles from './CardLink.module.css'

type MainLayoutRoutes = Pick<
	typeof PRIVATE_ROUTES,
	'CONTACTS' | 'CAMPANIES' | 'TEMPLATES'
>

type CardLinkProps = {
	isHovered: boolean
	onHover: () => void
	text: string
	title: string
	description: string
	imageUrl: string
	position: string
	url: MainLayoutRoutes[keyof MainLayoutRoutes]
	className?: string
}

const CardLink: FC<CardLinkProps> = ({
	isHovered,
	onHover,
	text,
	title,
	description,
	imageUrl,
	position,
	url,
	className
}) => {
	const { theme } = useTheme()
	const animationDuration = 0.5

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
				style={{
					background: 'var(--color-bg-default)'
				}}
			>
				<Layout
					direction='column'
					className='h-full items-start justify-between'
				>
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
								transition: 'color 0.5s ease'
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
								transition: 'color 0.5s ease'
							}}
						>
							{description}
						</Text>
					</Layout>
					<Link to={url as any} style={{ position: 'relative', zIndex: 1 }}>
						<motion.button
							className={`${styles.button} pointer mt-auto ${
								isHovered ? styles['button-hovered'] : ''
							}`}
							animate={{
								width: isHovered ? 'auto' : 'auto',
								paddingRight: '12px'
							}}
							transition={{ duration: animationDuration }}
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
							<IconAdd
								size='s'
								className='fill-current text-[#4391c5]'
							></IconAdd>
						</motion.button>
					</Link>
					<motion.img
						className={`absolute right-0 bottom-0 z-0 h-[180px] w-[200px] ${styles[position]}`}
						src={imageUrl}
						animate={{
							opacity: isHovered ? 1 : 0.1,
							scale: isHovered
								? position === 'image-top'
									? 1.6
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
				</Layout>
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
			</Card>
		</motion.div>
	)
}
export { CardLink }
