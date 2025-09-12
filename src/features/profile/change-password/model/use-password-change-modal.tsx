import { Button } from '@consta/uikit/Button'
import { useRef } from 'react'

import {
	PasswordChangeForm,
	type PasswordChangeFormHandle
} from '@/features/profile/change-password/ui/PasswordChangeForm'

import { modals } from '@/shared/lib/modals'

export function usePasswordChangeModal() {
	const formRef = useRef<PasswordChangeFormHandle>(null)
	const openPasswordChangeModal = () => {
		const handleClose = () => modals.closeTop()
		const handleSave = () => {
			formRef.current?.submitForm()
		}
		modals.openContent({
			title: 'Смена пароля',
			content: (
				<PasswordChangeForm
					ref={formRef}
					onSuccess={handleClose}
					onCancel={handleClose}
				/>
			),

			footer: (
				<div className='grid w-full grid-cols-2 gap-4'>
					<Button
						label='Отмена'
						view='ghost'
						onClick={handleClose}
						width='full'
					/>
					<Button
						label='Сохранить'
						view='primary'
						onClick={handleSave}
						width='full'
					/>
				</div>
			),
			containerClassName: 'w-[572px] max-w-[92vw]'
		})
	}

	return {
		openPasswordChangeModal
	}
}
