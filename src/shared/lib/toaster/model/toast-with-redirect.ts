import { type showCustomToastProps } from './custom-toast'

const TOAST_KEY = 'toast-message'

export function toastWithRedirect(payload: showCustomToastProps) {
	sessionStorage.setItem(TOAST_KEY, JSON.stringify(payload))
}

export function getToastFromSession(): showCustomToastProps | null {
	const toastData = sessionStorage.getItem(TOAST_KEY)
	if (toastData) {
		sessionStorage.removeItem(TOAST_KEY)
		try {
			return JSON.parse(toastData) as showCustomToastProps
		} catch (e) {
			console.error('Failed to parse toast data from sessionStorage', e)
			return null
		}
	}
	return null
}
