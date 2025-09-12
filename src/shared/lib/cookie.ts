import Cookies from 'js-cookie'

import { CONFIG } from './config'

export const setSessionToken = (token: string) => {
	Cookies.set('token', token, {
		domain: CONFIG.COOKIE_DOMAIN,
		expires: 30
	})
}

export const getSessionToken = () => {
	return Cookies.get('token')
}

export const removeSessionToken = () => {
	Cookies.remove('token', { domain: CONFIG.COOKIE_DOMAIN })
}
