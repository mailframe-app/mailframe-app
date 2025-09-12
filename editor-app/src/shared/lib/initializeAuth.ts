import { getSessionToken, setSessionToken } from './cookieSession'
import { CONFIG } from './envConfig'

export const initializeAuth = () => {
	const existingToken = getSessionToken()

	if (!existingToken && CONFIG.DEFAULT_TOKEN) {
		setSessionToken(CONFIG.DEFAULT_TOKEN)
		console.log('Auth initialized with default token')
	}
}
