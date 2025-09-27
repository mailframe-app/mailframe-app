import Cookies from 'js-cookie'

import { CONFIG } from './envConfig'

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

export const setThemeCookie = (theme: string) => {
	Cookies.set('theme', theme, {
		domain: CONFIG.COOKIE_DOMAIN,
		expires: 365
	})
}

export const getThemeCookie = () => {
	return Cookies.get('theme')
}

export const removeThemeCookie = () => {
	Cookies.remove('theme', { domain: CONFIG.COOKIE_DOMAIN })
}
