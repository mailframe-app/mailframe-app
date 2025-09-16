import { Layout as HeaderLayout } from '@consta/header/Layout'
import { Layout } from '@consta/uikit/Layout'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { ThemeToggle } from '@/features/theme'

import { PrivateLayoutNavbar } from './PrivateLayoutNavbar'
import { ProfileWidget } from '@/entities/profile'

export function PrivateLayout() {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<Layout
			direction='row'
			className='h-full w-full overflow-x-hidden overflow-y-auto'
			style={{
				backgroundColor: 'var(--color-bg-default)'
			}}
		>
			<PrivateLayoutNavbar navigate={navigate} location={location} />
			<Layout
				flex={1}
				direction='column'
				className='scroll-inset overflow-y-auto'
				style={{
					// scrollbarGutter: 'stable',
					backgroundColor: 'var(--color-bg-secondary)'
				}}
			>
				{/* @ts-ignore */}
				<HeaderLayout
					className='children-border-b-0 h-[80px] shrink-0 select-none'
					rowCenter={{
						// left: <BaseLogo size='xs' />,
						left: undefined,
						center: undefined,
						right: (
							<div className='flex h-full items-center gap-3 sm:gap-4'>
								<div className='hidden sm:block'>
									<ProfileWidget />
								</div>
								<ThemeToggle />
							</div>
						)
					}}
				/>
				<Layout
					direction='column'
					className='mt-8 mr-6 mb-6 ml-8 items-center rounded-xl p-8'
					style={{
						backgroundColor: 'var(--color-bg-default)'
					}}
				>
					<Outlet />
				</Layout>
			</Layout>
		</Layout>
	)
}
