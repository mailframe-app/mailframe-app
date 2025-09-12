import { FaGoogle, FaYandex } from 'react-icons/fa'

import type { ExternalStatusResponse } from '../api'
import type { Provider } from '../model/types'
import { useConnectExternalAccount } from '../model/use-connect-external'
import { useExternalStatus } from '../model/use-external-status'

import { ConnectionError } from './ConnectionError'
import { ConnectionView } from './ConnectionView'

const providers: Provider[] = [
	{
		name: 'Google',
		icon: <FaGoogle className='size-5 text-white' />,
		key: 'google',
		description: 'Настройте вход через Google для удобной и быстрой авторизации'
	},
	{
		name: 'Yandex',
		icon: <FaYandex className='size-5 text-white' />,
		key: 'yandex',
		description: 'Настройте вход через Yandex для удобной и быстрой авторизации'
	}
]

export function Connections() {
	const { data: statusData, isLoading: isLoadingStatus } = useExternalStatus()
	const { mutate: connect, isPending: isConnecting } =
		useConnectExternalAccount()

	let status: ExternalStatusResponse | undefined = undefined
	if (statusData && !('severity' in statusData)) {
		status = statusData as ExternalStatusResponse
	}

	return (
		<>
			<ConnectionView
				providers={providers}
				status={status}
				isLoadingStatus={isLoadingStatus}
				onConnect={connect}
				isConnecting={isConnecting}
			/>
			<ConnectionError />
		</>
	)
}
