import { Toaster as SonnerToaster } from 'sonner'

import { toasterConfig } from '../model/config'

import './toast-styles.css'

export function Toaster() {
	return <SonnerToaster {...toasterConfig} />
}
