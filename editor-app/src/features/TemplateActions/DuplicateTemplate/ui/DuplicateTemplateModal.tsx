import { Button } from '@consta/uikit/Button'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants'
import ModalShell from '@/shared/lib/modals/ui/ModalShell'

import { useDuplicateTemplate } from '../model/useDuplicateTemplate'

interface DuplicateTemplateModalProps {
	isOpen: boolean
	onClose: () => void
}

export const DuplicateTemplateModal: React.FC<DuplicateTemplateModalProps> = ({
	isOpen,
	onClose
}) => {
	const { isLoading, handleDuplicate } = useDuplicateTemplate()
	const navigate = useNavigate()

	const onConfirm = async () => {
		const newTemplateId = await handleDuplicate()
		if (newTemplateId) {
			navigate(ROUTES.TEMPLATE.replace(':templateId', newTemplateId))
			onClose()
		}
	}

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button label='Отмена' view='ghost' onClick={onClose} disabled={isLoading} />
			<Button label='Подтвердить' view='primary' onClick={onConfirm} loading={isLoading} />
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Дублирование шаблона'
			description='Создать копию данного шаблона?'
			containerClassName='w-[400px]'
			footer={footer}
		/>
	)
}
