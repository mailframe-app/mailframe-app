import { modals } from '@/shared/lib/modals'
import ModalShell from '@/shared/lib/modals/ui/ModalShell'

import { ImportHistory } from '../ui/ImportHistory'

export function useImportHistoryModal() {
	const openImportHistoryModal = () => {
		modals.openRender(({ close }) => (
			<ModalShell
				isOpen
				onClose={close}
				title='История импортов'
				containerClassName='p-4 w-[80vw] h-[80vh] max-w-[92vw]'
			>
				<ImportHistory />
			</ModalShell>
		))
	}

	return { openImportHistoryModal }
}
