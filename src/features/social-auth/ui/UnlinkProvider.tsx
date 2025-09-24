import { Button } from '@consta/uikit/Button'

import { modals } from '@/shared/lib/modals'

import { useUnlinkExternal } from '../model/use-unlink-external'

interface UnlinkProviderProps {
	provider: 'google' | 'yandex'
}

export function UnlinkProvider({ provider }: UnlinkProviderProps) {
	const { mutate, isPending } = useUnlinkExternal({
		provider
	})

	const handleUnlink = () => {
		const providerName = provider === 'google' ? 'Google' : 'Яндекс'

		modals.openDeleteModal({
			title: `Отключить аккаунт ${providerName}?`,
			description: `После отключения вы не сможете использовать этот аккаунт для входа в систему.`,
			onConfirm: () => mutate(),
			confirmLabel: 'Отключить',
			cancelLabel: 'Отмена',
			confirmTone: 'alert',
			closeButton: false
		})
	}

	return (
		<Button
			label='Отключить'
			view='secondary'
			className='!border !border-[var(--color-bg-alert)] !text-[var(--color-bg-alert)]'
			onClick={handleUnlink}
			loading={isPending}
		/>
	)
}
