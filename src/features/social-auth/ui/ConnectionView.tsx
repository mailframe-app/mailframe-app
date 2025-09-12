import { Layout } from '@consta/uikit/Layout'
import { Loader } from '@consta/uikit/Loader'
import { Text } from '@consta/uikit/Text'

import type { ExternalStatusResponse } from '../api'
import type { Provider } from '../model/types'

import { ConnectionError } from './ConnectionError'
import { ProviderCard } from './ProviderCard'

interface ConnectionViewProps {
	providers: Provider[]
	status?: ExternalStatusResponse
	isLoadingStatus: boolean
	onConnect: (providerKey: 'google' | 'yandex') => void
	isConnecting: boolean
}

export function ConnectionView({
	providers,
	status,
	isLoadingStatus,
	onConnect,
	isConnecting
}: ConnectionViewProps) {
	if (isLoadingStatus)
		return (
			<Layout direction='column'>
				<div className='flex w-full items-center justify-center pt-10'>
					<Loader type='dots' size='s' />
				</div>
			</Layout>
		)

	return (
		<>
			<Layout direction='column'>
				<div className='w-full'>
					<Text view='secondary' size='s' weight='regular' className='mb-4'>
						Подключите и управляйте своими аккаунтами с использованием сторонних
						сервисов
					</Text>

					<div className='space-y-5'>
						{providers.map(provider => (
							<ProviderCard
								key={provider.key}
								provider={provider}
								status={status}
								onConnect={onConnect}
								isConnecting={isConnecting}
							/>
						))}
					</div>
				</div>
			</Layout>
			<ConnectionError />
		</>
	)
}
