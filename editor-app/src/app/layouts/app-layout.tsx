import { Outlet } from 'react-router-dom'

import { Toaster } from '@/shared/lib'

export function AppLayout() {
	return (
		<>
			<Outlet />
			<Toaster />
		</>
	)
}
