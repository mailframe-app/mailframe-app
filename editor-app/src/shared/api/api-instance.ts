import type { AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'

import { CONFIG, getSessionToken } from '@/shared/lib'

const isClient = () => {
	return typeof window !== 'undefined'
}

export const apiInstance = axios.create({
	baseURL: isClient() ? '/api' : CONFIG.API_BASE_URL + '/api',
	headers: {
		'Content-Type': 'application/json'
	}
})

apiInstance.interceptors.request.use(
	config => {
		const token = getSessionToken()
		if (token) {
			config.headers['X-Session-Token'] = token
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

export const createInstance = async <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<T> => {
	return apiInstance({ ...config, ...options }).then(res => res.data)
}

export type BodyType<Data> = Data

export type ErrorType<Error> = AxiosError<Error>
