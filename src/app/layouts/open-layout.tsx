import { Layout } from '@consta/uikit/Layout'
import { Outlet } from 'react-router-dom'

export function OpenLayout() {
	return (
		<Layout
			direction='column'
			className='h-full w-full items-center justify-center bg-[var(--color-bg-default)] sm:bg-[var(--color-bg-secondary)]'
		>
			{/* @ts-ignore */}
			{/* <HeaderLayout
				className='children-border-b-0 h-[80px] shrink-0 select-none'
				rowCenter={{
					left: <BaseLogo size='xs' />,
					center: undefined,
					right: (
						<>
							<div className='hidden md:block'>
								<ThemeToggle />
							</div>
							<div className='block md:hidden'>
								<MobileThemeToggle size='m' />
							</div>
						</>
					)
				}}
			/> */}
			<Outlet />
		</Layout>
	)
}
