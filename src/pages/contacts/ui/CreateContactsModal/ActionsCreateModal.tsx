import { Layout } from '@consta/uikit/Layout'
import { useNavigate } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants/routes'
import { ModalShell } from '@/shared/ui/Modals'

import ActionCard from './ActionCard'
import importImg from './assets/import.png'
import manualImg from './assets/manual.png'

function ActionsCreateModal({
	isOpen,
	onClose
}: {
	isOpen: boolean
	onClose: () => void
}) {
	const navigate = useNavigate()
	return (
		<ModalShell
			title='Добавление контактов'
			isOpen={isOpen}
			onClose={onClose}
			onClickOutside={onClose}
		>
			<Layout direction='row' gap='m'>
				<ActionCard
					title='Вручную'
					onClick={() => {
						onClose()
						navigate(`${PRIVATE_ROUTES.CREATE_CONTACTS}?tab=manual`)
					}}
					image={manualImg}
				></ActionCard>
				<ActionCard
					title='Импорт контактов'
					onClick={() => {
						onClose()
						navigate(`${PRIVATE_ROUTES.CREATE_CONTACTS}?tab=import`)
					}}
					image={importImg}
				></ActionCard>
			</Layout>
		</ModalShell>
	)
}

export default ActionsCreateModal
