import { IconCheck } from '@consta/icons/IconCheck'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

import type { ExternalStatusResponse } from '../api'
import type { Provider } from '../model/types'

import { UnlinkProvider } from './UnlinkProvider'

interface ProviderCardProps {
	provider: Provider
	status?: ExternalStatusResponse
	onConnect: (providerKey: 'google' | 'yandex') => void
	isConnecting: boolean
}

export function ProviderCard({
	provider,
	status,
	onConnect,
	isConnecting
}: ProviderCardProps) {
	const isConnected = status && status[provider.key]

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='w-full !rounded-lg border border-[var(--color-bg-ghost)]'
			shadow={false}
		>
			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-x-6'>
					<div
						className='flex h-12 w-12 items-center justify-center rounded-full'
						style={{
							backgroundColor: 'var(--color-control-bg-primary)'
						}}
					>
						{provider.icon}
					</div>
					<div className='flex flex-col'>
						<div className='flex items-center gap-2'>
							<Text view='primary' size='l' weight='semibold' as='h2'>
								{provider.name}
							</Text>
							{isConnected && (
								<Badge
									label='Подключено'
									status='success'
									view='tinted'
									iconLeft={IconCheck}
								/>
							)}
						</div>
						<Text view='secondary' size='s' as='p' className='mt-1'>
							{provider.description}
						</Text>
					</div>
				</div>
				{isConnected ? (
					<UnlinkProvider provider={provider.key} />
				) : (
					<Button
						onClick={() => onConnect(provider.key)}
						view='clear'
						className='!border !border-[var(--color-bg-ghost)]'
						loading={isConnecting}
						label='Подключить'
					/>
				)}
			</div>
		</Card>
	)
}
