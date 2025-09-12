import type { ToasterProps } from 'sonner'

export const toasterConfig: ToasterProps = {
	position: 'bottom-right',
	closeButton: true,
	icons: {
		success: null,
		error: null,
		loading: null,
		warning: null,
		info: null
	},
	toastOptions: {
		style: {
			color: 'white',
			borderRadius: '8px',
			padding: '12px 16px',
			border: 'none'
		},
		classNames: {
			toast: 'custom-toast',
			title: 'custom-toast-title',
			description: 'custom-toast-description',
			closeButton: 'custom-toast-close-button',
			success: 'custom-toast-success',
			error: 'custom-toast-error',
			info: 'custom-toast-info',
			warning: 'custom-toast-warning'
		}
	}
}
