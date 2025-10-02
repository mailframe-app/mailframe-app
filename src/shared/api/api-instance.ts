import type { AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'

import { CONFIG, getSessionToken } from '@/shared/lib'

const isClient = () => {
	return typeof window !== 'undefined'
}

/**
 * createInstance - универсальная функция для выполнения HTTP-запросов через apiInstance.
 *
 * @template T - ожидаемый тип данных ответа.
 * @param {AxiosRequestConfig} config - основной конфиг запроса (метод, url, data и т.д.).
 * @param {AxiosRequestConfig} [options] - дополнительные опции, которые будут объединены с config.
 * @returns {Promise<T>} - промис с данными типа T из ответа сервера.
 *
 * Пример:
 *   const data = await createInstance<MyType>({ method: 'GET', url: '/users' });
 *
 * Особенности:
 * - Использует глобальный apiInstance с преднастроенными интерцепторами.
 * - Автоматически добавляет X-Session-Token, если он есть.
 * - Объединяет config и options, где options имеет приоритет.
 */
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

/**
 * apiInstance - экземпляр Axios с преднастроенным baseURL и заголовками.
 *
 * Особенности:
 * - baseURL зависит от среды: на клиенте '/api', на сервере — из CONFIG.API_BASE_URL.
 * - По умолчанию устанавливает заголовок 'Content-Type: application/json'.
 * - В каждом запросе автоматически добавляет заголовок 'X-Session-Token', если токен присутствует (через getSessionToken()).
 * - Использует интерцепторы для обработки запросов и ошибок.
 *
 * Использование:
 *   await apiInstance.get('/users')
 *   await apiInstance.post('/login', { username, password })
 *
 * Для типизированных запросов используйте createInstance<T>().
 */

export const createInstance = async <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<T> => {
	return apiInstance({ ...config, ...options }).then(res => res.data)
}

export type BodyType<Data> = Data

export type ErrorType<Error> = AxiosError<Error>
