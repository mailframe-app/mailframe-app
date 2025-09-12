import { IconAdd } from '@consta/icons/IconAdd'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { type FC } from 'react'
import { Link } from 'react-router-dom'

import { useTheme } from '@/features/theme'

import { PRIVATE_ROUTES } from '@/shared/constants'

import elipse from '../assets/elipse.png'

import './CardLink.css'

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
}

const CardLink: FC<CardLinkProps> = ({
	isHovered,
	onHover,
	text,
	title,
	description,
	imageUrl,
	position,
	url
}) => {
	const { theme } = useTheme()

	const cardBackground =
		theme === 'presetGpnDark'
			? 'var(--color-bg-secondary)'
			: theme === 'presetGpnDisplay'
				? '#002d47'
				: '#f5f8fa'

	return (
		<Card
			verticalSpace='m'
			horizontalSpace='m'
			className={`relative flex min-w-[24%] cursor-pointer flex-col overflow-hidden !rounded-lg transition-all duration-500 ease-in ${isHovered ? 'hovered min-w-[49%] !bg-[#4391c5]' : ''} card-container`}
			onMouseEnter={onHover}
			style={{
				background: cardBackground
			}}
		>
			<Layout direction='column' className='h-full items-start justify-between'>
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
									: ''
						}}
					>
						{title}
					</Text>
					<Text
						className={`mb-auto ${!isHovered ? 'ellipsis-text' : 'full-text'}`}
						view='primary'
						as='h4'
						size='s'
						weight='regular'
						align='center'
						style={{
							color: isHovered ? 'white' : '',
							textAlign: 'left'
						}}
					>
						{description}
					</Text>
				</Layout>
				<Link to={url as any} style={{ position: 'relative', zIndex: 1 }}>
					<button
						className={`button pointer mt-auto ${
							isHovered ? 'button-hovered' : ''
						}`}
					>
						{isHovered ? text : ''}
						<IconAdd size='s' className='fill-current text-[#4391c5]'></IconAdd>
					</button>
				</Link>
				<img
					className={`absolute right-0 bottom-0 z-0 h-[180px] w-[200px] scale-100 transition-all duration-500 ease-in ${
						isHovered ? 'opacity-100' : 'opacity-10'
					} ${position} ${isHovered && position === 'image-top' ? 'scale-160' : ''} ${isHovered && position === 'image-bottom' ? 'scale-120' : ''} `}
					src={imageUrl}
				></img>
			</Layout>
			<img
				src={elipse}
				className={`absolute ${
					isHovered
						? 'translate-x-[0] opacity-100'
						: 'translate-x-[-200%] opacity-0'
				} bottom-0 left-[-1%] z-0 translate-y-0 opacity-100`}
			></img>
		</Card>
	)
}
export { CardLink }
