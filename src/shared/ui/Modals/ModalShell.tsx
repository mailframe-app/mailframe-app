import { IconClose } from '@consta/icons/IconClose'
import { Button } from '@consta/uikit/Button'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import React from 'react'

export type ModalShellProps = {
	isOpen: boolean
	onClose: () => void
	hasOverlay?: boolean
	onClickOutside?: () => void
	title?: React.ReactNode
	description?: React.ReactNode
	children?: React.ReactNode
	footer?: React.ReactNode
	containerClassName?: string
	closeButton?: boolean
	headerAlign?: 'left' | 'center' | 'right'
}

const ModalShell: React.FC<ModalShellProps> = ({
	isOpen,
	onClose,
	hasOverlay = true,
	onClickOutside = onClose,
	title,
	description,
	children,
	footer,
	containerClassName = 'w-[560px] max-w-[92vw]',
	closeButton = true,
	headerAlign = 'left'
}) => {
	return (
		<Modal
			isOpen={isOpen}
			hasOverlay={hasOverlay}
			onEsc={onClose}
			onClickOutside={onClickOutside}
			className='!rounded-2xl'
			style={{ zIndex: 9999 }}
		>
			<div className={`${containerClassName} relative p-6`}>
				{closeButton ? (
					<Button
						view='clear'
						form='round'
						size='s'
						onlyIcon
						iconLeft={IconClose}
						onClick={onClose}
						className='!absolute top-4 right-4'
					/>
				) : null}
				{title ? (
					<Text
						size='2xl'
						weight='bold'
						className={`mb-4 ${headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : ''}`}
						view='primary'
					>
						{title}
					</Text>
				) : null}
				{description ? (
					<Text
						size='s'
						view='secondary'
						className={`mb-8 ${headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : ''}`}
					>
						{description}
					</Text>
				) : null}
				{children ? <div className='mb-2'>{children}</div> : null}
				{footer ? <div className='mt-4'>{footer}</div> : null}
			</div>
		</Modal>
	)
}

export default ModalShell
