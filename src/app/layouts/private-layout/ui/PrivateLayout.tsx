import { Layout } from '@consta/uikit/Layout'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { PrivateLayoutNavbar } from './PrivateLayoutNavbar'

export function PrivateLayout() {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<Layout
			direction='row'
			className='h-full w-full overflow-x-hidden overflow-y-auto'
		>
			<PrivateLayoutNavbar navigate={navigate} location={location} />
			<Layout
				flex={1}
				direction='column'
				className='scroll-inset overflow-y-auto'
				style={{ scrollbarGutter: 'stable' }}
			>
				<Layout
					direction='column'
					className='m-8 items-center rounded-xl p-8'
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
