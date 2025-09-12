import { createBrowserRouter, redirect } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'

import { AppLayout } from '../layouts'
import { ThemeProvider } from '../providers'

import { getTemplate } from '@/entities/EditorTemplate'
import { getBlocks } from '@/entities/ReusableBlocks'
import { getTags } from '@/entities/Tags'
import { EditorPage } from '@/pages/editor-page/editor.page'
import { TemplatesPage } from '@/pages/templates.page'

export const router = createBrowserRouter([
	{
		element: (
			<ThemeProvider>
				<AppLayout />
			</ThemeProvider>
		),
		children: [
			{
				path: ROUTES.TEMPLATES,
				element: <TemplatesPage />
			},
			{
				path: ROUTES.TEMPLATE,
				element: <EditorPage />,
				loader: async ({ params }) => {
					try {
						const templateId = params.templateId
						if (!templateId) {
							return redirect(ROUTES.TEMPLATES)
						}

						const [template, blocks, tags] = await Promise.all([
							getTemplate(templateId),
							getBlocks(),
							getTags()
						])

						return { template, blocks, tags }
					} catch {
						return redirect(ROUTES.TEMPLATES)
					}
				}
			}
		]
	},
	{
		path: '*',
		loader: () => {
			return redirect(ROUTES.TEMPLATES)
		}
	}
])
