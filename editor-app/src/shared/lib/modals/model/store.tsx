import { Button } from '@consta/uikit/Button'
import { createGStore } from 'create-gstore'
import type { ReactNode } from 'react'
import { useState } from 'react'

import ModalShell from '../ui/ModalShell'

import type {
	ConfirmModalOptions,
	ContentModalOptions,
	DeleteModalOptions,
	ModalInstance,
	ModalRender
} from './types'

function generateId(): string {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function buildContentRender(options: ContentModalOptions): ModalRender {
	return ({ close }) => (
		<ModalShell
			isOpen
			onClose={close}
			title={options.title}
			description={options.description}
			containerClassName={options.containerClassName}
			closeButton={options.closeButton}
			hasOverlay={options.hasOverlay}
			onClickOutside={options.onClickOutside ?? close}
			headerAlign={options.headerAlign ?? 'left'}
		>
			{options.content}
			{options.footer ? <div className='mt-4'>{options.footer}</div> : null}
		</ModalShell>
	)
}

function buildConfirmRender(options: ConfirmModalOptions): ModalRender {
	return ({ close }) => {
		const confirmStyle =
			options.confirmButtonStyle ??
			(options.confirmTone === 'alert' ? { background: 'var(--color-bg-alert)' } : undefined)
		return (
			<ModalShell
				isOpen
				onClose={close}
				title={options.title ?? 'Действие'}
				description={options.description ?? 'Вы уверены, что хотите продолжить?'}
				containerClassName={options.containerClassName ?? 'w-[400px] max-w-[92vw]'}
				closeButton={options.closeButton ?? true}
				hasOverlay={options.hasOverlay ?? true}
				headerAlign='center'
			>
				<div className='grid w-full grid-cols-2 gap-4 pt-4'>
					<Button
						view='ghost'
						width='full'
						label={options.cancelLabel ?? 'Отмена'}
						onClick={close}
					/>
					<Button
						view='primary'
						width='full'
						label={options.confirmLabel ?? 'Продолжить'}
						onClick={async () => {
							await options.onConfirm()
							close()
						}}
						style={confirmStyle}
					/>
				</div>
			</ModalShell>
		)
	}
}

export const useModals = createGStore(() => {
	const [stack, setStack] = useState<ModalInstance[]>([])

	const openRender = (render: ModalRender): string => {
		const id = generateId()
		setStack(s => [...s, { id, render }])
		return id
	}

	const openElement = (element: ReactNode): string => openRender(() => element as any)
	const openContent = (options: ContentModalOptions): string =>
		openRender(buildContentRender(options))
	const openConfirm = (options: ConfirmModalOptions): string =>
		openRender(buildConfirmRender(options))
	const openDeleteModal = (options: DeleteModalOptions): string =>
		openConfirm({
			title: options.title ?? 'Удаление',
			description: options.description ?? 'Вы уверены, что хотите удалить?',
			confirmLabel: options.confirmLabel ?? 'Удалить',
			cancelLabel: options.cancelLabel ?? 'Отмена',
			onConfirm: options.onConfirm,
			containerClassName: options.containerClassName,
			closeButton: options.closeButton,
			hasOverlay: options.hasOverlay,
			confirmTone: options.confirmTone ?? 'alert',
			confirmButtonStyle: options.confirmButtonStyle
		})

	const close = (id: string): void => setStack(s => s.filter(m => m.id !== id))
	const closeTop = (): void => setStack(s => s.slice(0, -1))
	const closeAll = (): void => setStack([])

	return {
		stack,
		openRender,
		openElement,
		openContent,
		openConfirm,
		openDeleteModal,
		close,
		closeTop,
		closeAll
	}
})

export const modals = {
	use: useModals,
	openRender: (render: ModalRender) => useModals.getState().openRender(render),
	openElement: (element: ReactNode) => useModals.getState().openElement(element),
	openContent: (options: ContentModalOptions) => useModals.getState().openContent(options),
	openConfirm: (options: ConfirmModalOptions) => useModals.getState().openConfirm(options),
	openDeleteModal: (options: DeleteModalOptions) => useModals.getState().openDeleteModal(options),
	close: (id: string) => useModals.getState().close(id),
	closeTop: () => useModals.getState().closeTop(),
	closeAll: () => useModals.getState().closeAll()
}
