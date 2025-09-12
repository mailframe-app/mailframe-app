import { useEffect } from 'react'

import { showCustomToast } from './custom-toast'
import { getToastFromSession } from './toast-with-redirect'

export function useToastFromSession() {
	useEffect(() => {
		const toastPayload = getToastFromSession()
		if (toastPayload) {
			showCustomToast(toastPayload)
		}
	}, [])
}
