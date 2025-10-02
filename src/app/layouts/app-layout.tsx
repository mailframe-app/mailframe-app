import { Layout } from '@consta/uikit/Layout'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
	return (
		<Layout direction='column' className='h-screen items-center justify-center'>
			<Outlet />
		</Layout>
	)
}
