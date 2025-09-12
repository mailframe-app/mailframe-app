import { modals } from '@/shared/lib/modals'

import { useSmtpSettings } from '@/entities/mail-settings'

export const useDeleteSmtpSettings = () => {
	const { deleteSmtpSettings } = useSmtpSettings()

	const openDeleteConfirm = (id: string, serverName: string) => {
		modals.openDeleteModal({
			title: 'Удаление почтового клиента',
			description: `Вы уверены, что хотите удалить настройки почтового клиента "${serverName}"?`,
			closeButton: false,
			onConfirm: async () => {
				await deleteSmtpSettings(id)
			}
		})
	}

	return { openDeleteConfirm }
}
