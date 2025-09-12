import { IconClose } from '@consta/icons/IconClose'
import { IconScreenStroked } from '@consta/icons/IconScreenStroked'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Smartphone } from 'lucide-react'
import React from 'react'

import { VIEWPORT_SIZES } from '../model/constants'
import type { PreviewControlsProps } from '../model/types'

export const PreviewControls: React.FC<PreviewControlsProps> = ({
	isMobileView,
	onViewToggle,
	onClose
}) => {
	const SmartphoneIcon = () => <Smartphone size={16} />

	return (
		<div className='-mt-4 mb-4'>
			<div
				className='flex items-center justify-between transition-all duration-300 ease-in-out'
				style={{ width: isMobileView ? VIEWPORT_SIZES.MOBILE.width : VIEWPORT_SIZES.DESKTOP.width }}
			>
				<Card
					shadow={false}
					border={false}
					className='flex items-center gap-1 !rounded-lg p-1'
					style={{
						backgroundColor: 'var(--color-bg-default)'
					}}
				>
					<Button
						view={isMobileView ? 'clear' : 'ghost'}
						onlyIcon
						iconLeft={IconScreenStroked}
						size='s'
						onClick={() => onViewToggle(false)}
						title={VIEWPORT_SIZES.DESKTOP.label}
					/>
					<Button
						view={isMobileView ? 'ghost' : 'clear'}
						onlyIcon
						iconLeft={SmartphoneIcon}
						size='s'
						onClick={() => onViewToggle(true)}
						title={VIEWPORT_SIZES.MOBILE.label}
					/>
				</Card>
				<Card
					shadow={false}
					border={false}
					className='!rounded-lg p-1'
					style={{
						backgroundColor: 'var(--color-bg-default)'
					}}
				>
					<Button
						view='clear'
						onlyIcon
						iconLeft={IconClose}
						size='s'
						onClick={onClose}
						title='Закрыть предпросмотр'
					/>
				</Card>
			</div>
		</div>
	)
}
