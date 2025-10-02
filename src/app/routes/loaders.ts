import { formatISO, subDays } from 'date-fns'
import { type LoaderFunctionArgs, redirect } from 'react-router-dom'

import { externalStatusQuery } from '@/features/social-auth'

import { queryClient } from '@/shared/api/query-client'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/shared/constants'
import { toastWithRedirect } from '@/shared/lib'
import { getSessionToken } from '@/shared/lib/cookie'

import { summaryQuery, timeseriesQuery } from '@/entities/analytics'
import { campaignDetailQuery, campaignsListQuery } from '@/entities/campaigns'
import { contactFieldsQuery } from '@/entities/contacts'
import { smtpQuery } from '@/entities/mail-settings'
import { profileQuery, verifyEmail } from '@/entities/profile'
import { sessionQuery } from '@/entities/session'

// Предзагрузка данных пользователя для быстрого отображения страницы
export async function privateRouteLoader(): Promise<Response | null> {
	const token = getSessionToken()

	if (!token) {
		return redirect(PUBLIC_ROUTES.LOGIN)
	}

	await Promise.all([
		queryClient.prefetchQuery({
			...profileQuery()
		})
	])

	return null
}

// Проверка токена для публичных страниц
export async function publicRouteLoader(): Promise<Response | null> {
	const token = getSessionToken()

	if (token) {
		return redirect(PRIVATE_ROUTES.DASHBOARD)
	}

	return null
}

// Проверка кода верификации электронной почты
export async function verifyEmailLoader({
	params
}: LoaderFunctionArgs): Promise<Response> {
	const { code } = params

	if (code) {
		try {
			const response = await verifyEmail(code)
			toastWithRedirect({
				title: response.message,
				type: 'success'
			})
		} catch (error: unknown) {
			const errorMessage =
				error &&
				typeof error === 'object' &&
				'message' in error &&
				typeof error.message === 'string'
					? error.message
					: 'Ошибка проверки электронной почты'
			toastWithRedirect({
				title: errorMessage,
				type: 'error'
			})
		}
	} else {
		toastWithRedirect({
			title: 'Код подтверждения отсутствует',
			type: 'error'
		})
	}

	const token = getSessionToken()
	if (token) {
		return redirect(PRIVATE_ROUTES.SECURITY)
	} else {
		return redirect(PUBLIC_ROUTES.LOGIN)
	}
}

// Предзагрузка для страницы контактов: только поля
export async function contactsRouteLoader(): Promise<null> {
	await queryClient.prefetchQuery({ ...contactFieldsQuery() })
	return null
}

// Предзагрузка для страницы участников группы: только поля
export async function groupMembersRouteLoader(): Promise<null> {
	await queryClient.prefetchQuery({ ...contactFieldsQuery() })
	return null
}

// Предзагрузка для страницы настроек SMTP
export async function smtpSettingsRouteLoader(): Promise<null> {
	await queryClient.prefetchQuery({ ...smtpQuery() })
	return null
}

// Предзагрузка для страницы интеграций
export async function socialAuthRouteLoader(): Promise<null> {
	await queryClient.prefetchQuery({
		...externalStatusQuery()
	})
	return null
}

// Предзагрузка для страницы активных сессий
export async function sessionsRouteLoader(): Promise<null> {
	await queryClient.prefetchQuery({
		...sessionQuery()
	})
	return null
}

// Предзагрузка для страницы dashboard - последние рассылки и аналитика
export async function dashboardRouteLoader(): Promise<null> {
	const dateRange = [subDays(new Date(), 30), new Date()]
	const params = {
		from:
			formatISO(dateRange[0], { representation: 'date' }) + 'T00:00:00.000Z',
		to: formatISO(dateRange[1], { representation: 'date' }) + 'T23:59:59.999Z'
	}

	await Promise.all([
		// Последние рассылки
		queryClient.prefetchQuery({
			...campaignsListQuery({
				limit: 3,
				sortBy: 'updatedAt',
				sortOrder: 'desc'
			})
		}),
		// Сводная статистика
		queryClient.prefetchQuery({
			...summaryQuery(params)
		}),
		// Временные ряды для всех метрик
		...['sent', 'opened', 'clicked'].map(metric =>
			queryClient.prefetchQuery({
				...timeseriesQuery({
					metric: metric as any,
					bucket: 'day',
					...params
				})
			})
		)
	])

	return null
}

// Предзагрузка для страницы рассылки
export async function campaignRouteLoader({
	params
}: LoaderFunctionArgs): Promise<null> {
	const { campaignId } = params
	if (campaignId) {
		await queryClient.prefetchQuery({
			...campaignDetailQuery(campaignId)
		})
	}
	return null
}
