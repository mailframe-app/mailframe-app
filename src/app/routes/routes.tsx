import { createBrowserRouter, redirect } from 'react-router-dom'

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/shared/constants'

import { AppLayout, OpenLayout, PrivateLayout } from '../layouts'
import { AppLoader } from '../loaders'
import { AppProvider } from '../providers'

import {
	campaignRouteLoader,
	contactsRouteLoader,
	dashboardRouteLoader,
	groupMembersRouteLoader,
	privateRouteLoader,
	publicRouteLoader,
	sessionsRouteLoader,
	smtpSettingsRouteLoader,
	socialAuthRouteLoader,
	verifyEmailLoader
} from './loaders'
import { SettingsLayout } from '@/pages/settings'

export const router = createBrowserRouter([
	{
		element: (
			<AppProvider>
				<AppLoader>
					<AppLayout />
				</AppLoader>
			</AppProvider>
		),
		children: [
			{
				element: <PrivateLayout />,
				loader: privateRouteLoader,
				children: [
					{
						path: PRIVATE_ROUTES.DASHBOARD,
						lazy: () => import('@/pages/dashboard/dashboard.page'),
						loader: dashboardRouteLoader
					},
					{
						path: PRIVATE_ROUTES.CONTACTS,
						lazy: () => import('@/pages/contacts/contacts.page'),
						loader: contactsRouteLoader
					},
					{
						path: PRIVATE_ROUTES.CREATE_CONTACTS,
						lazy: () => import('@/pages/contacts/create.page')
					},
					{
						path: PRIVATE_ROUTES.GROUP_MEMBERS,
						lazy: () => import('@/pages/contacts/group-members.page'),
						loader: groupMembersRouteLoader
					},
					{
						path: PRIVATE_ROUTES.ANALYTICS,
						lazy: () => import('@/pages/analytics/analytics.page')
					},
					{
						path: PRIVATE_ROUTES.TEMPLATES,
						lazy: () => import('@/pages/templates/templates.page')
					},
					{
						path: PRIVATE_ROUTES.CAMPANIES,
						lazy: () => import('@/pages/campaigns/campaigns.page')
					},
					{
						path: PRIVATE_ROUTES.CAMPAIGN_EDIT,
						lazy: () => import('@/pages/campaigns/campaign-edit.page'),
						loader: campaignRouteLoader
					},
					{
						path: PRIVATE_ROUTES.CAMPAIGN_SCHEDULE,
						lazy: () => import('@/pages/campaigns/campaign-schedule.page'),
						loader: campaignRouteLoader
					},
					{
						path: PRIVATE_ROUTES.CAMPAIGN_OVERVIEW,
						lazy: () => import('@/pages/campaigns/campaign-overview.page'),
						loader: campaignRouteLoader
					},
					{
						element: <SettingsLayout />,
						children: [
							{
								path: PRIVATE_ROUTES.PROFILE,
								lazy: () => import('@/pages/settings/profile.page')
							},
							{
								path: PRIVATE_ROUTES.MAIL_SETTINGS,
								lazy: () => import('@/pages/settings/smtp.page'),
								loader: smtpSettingsRouteLoader
							},

							{
								path: PRIVATE_ROUTES.SECURITY,
								lazy: () => import('@/pages/settings/security.page'),
								loader: sessionsRouteLoader
							},
							{
								path: PRIVATE_ROUTES.CONNECTIONS,
								lazy: () => import('@/pages/settings/connections.page'),
								loader: socialAuthRouteLoader
							}
						]
					}
				]
			},
			{
				element: <OpenLayout />,
				loader: publicRouteLoader,
				children: [
					{
						path: PUBLIC_ROUTES.LOGIN,
						lazy: () => import('@/pages/auth/login.page')
					},
					{
						path: PUBLIC_ROUTES.REGISTER,
						lazy: () => import('@/pages/auth/register.page')
					},
					{
						path: PUBLIC_ROUTES.FORGOT_PASSWORD,
						lazy: () => import('@/pages/auth/forgot-password.page')
					},
					{
						path: PUBLIC_ROUTES.RECOVERY_PASSWORD,
						lazy: () => import('@/pages/auth/recovery-password.page')
					},
					{
						path: PUBLIC_ROUTES.AUTH_CALLBACK,
						lazy: () => import('@/pages/auth/callback.page')
					},
					{
						path: PUBLIC_ROUTES.VERIFY_EMAIL,
						loader: verifyEmailLoader
					},
					{
						path: PUBLIC_ROUTES[500],
						lazy: () => import('@/pages/error/500.page')
					}
				]
			}
		]
	},

	{
		path: '*',
		loader: () => {
			return redirect(PRIVATE_ROUTES.DASHBOARD)
		}
	}
])
