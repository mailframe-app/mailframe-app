import { Layout } from '@consta/uikit/Layout'
import { Outlet } from 'react-router-dom'

export function OpenLayout() {
	return (
		<Layout
			direction='column'
			className='h-full w-full items-center justify-center bg-[var(--color-bg-default)] sm:bg-[var(--color-bg-secondary)]'
		>
			<Outlet />
		</Layout>
	)
}
