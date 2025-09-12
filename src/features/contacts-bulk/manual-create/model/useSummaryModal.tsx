import { Button } from '@consta/uikit/Button'

import { modals } from '@/shared/lib/modals'
import ModalShell from '@/shared/lib/modals/ui/ModalShell'

import type { Summary } from '../ui/SummaryResult'
import { SummaryResult } from '../ui/SummaryResult'

export function useSummaryModal() {
	const openSummaryModal = (summary: Summary) => {
		modals.openRender(({ close }) => (
			<ModalShell
				isOpen
				onClose={close}
				title='Результаты создания контактов'
				footer={
					<div className='flex justify-end'>
						<Button view='primary' label='Закрыть' onClick={close} />
					</div>
				}
			>
				<SummaryResult summary={summary} />
			</ModalShell>
		))
	}

	return { openSummaryModal }
}
