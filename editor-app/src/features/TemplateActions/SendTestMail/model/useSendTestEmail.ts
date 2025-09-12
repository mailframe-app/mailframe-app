import { useState } from 'react'

import { type SendTestEmailDto, sendTestEmail } from '@/features/TemplateActions/api'

import { showCustomToast } from '@/shared/lib'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'

export const useSendTestEmail = () => {
	const { template } = useEditorTemplateStore()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const sendEmail = async (data: SendTestEmailDto) => {
		if (!template?.id) {
			setError('Template ID is not available.')
			return
		}
		setIsLoading(true)
		setError(null)

		try {
			const result = await sendTestEmail(template.id, data)
			if (result.success) {
				showCustomToast({
					title: `Письмо отправлено на указанный адрес: ${data.recipientEmail}`,
					type: 'success'
				})
			} else if (!result.success) {
				showCustomToast({ description: result.message, type: 'error', title: 'Ошибка' })
			}
		} catch {
			showCustomToast({ title: 'Произошла ошибка при отправке тестового письма', type: 'error' })
		} finally {
			setIsLoading(false)
		}
	}

	const resetState = () => {
		setIsLoading(false)
		setError(null)
	}

	return {
		sendEmail,
		isLoading,
		error,
		resetState
	}
}
