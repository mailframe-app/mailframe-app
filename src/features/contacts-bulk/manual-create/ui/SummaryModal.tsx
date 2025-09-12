import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'

import ModalShell from '@/shared/ui/Modals/ModalShell'

export type Summary = {
	success: boolean
	processed: number
	failed: number
	errors?: string[]
}

type Props = {
	isOpen: boolean
	onClose: () => void
	summary?: Summary
}

function SummaryModal({ isOpen, onClose, summary }: Props) {
	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			onClickOutside={onClose}
			title='Результаты создания контактов'
			footer={<Button view='primary' label='Закрыть' onClick={onClose} />}
		>
			{summary ? (
				<div className='flex flex-col gap-3'>
					<div className='grid grid-cols-1 gap-1 text-sm md:grid-cols-3'>
						<div>
							<Text size='s' view='secondary'>
								Успешно:
							</Text>{' '}
							{summary.processed}
						</div>
						<div>
							<Text size='s' view='secondary'>
								Ошибки:
							</Text>{' '}
							{summary.failed}
						</div>
						<div>
							<Text size='s' view='secondary'>
								Статус:
							</Text>{' '}
							{summary.success ? 'OK' : 'Ошибка'}
						</div>
					</div>
					{Array.isArray(summary.errors) && summary.errors.length > 0 && (
						<div>
							<Text size='s'>Ошибки</Text>
							<div className='border-border mt-2 max-h-64 overflow-auto rounded border p-2 text-xs'>
								{summary.errors.map((e, idx) => (
									<div
										key={idx}
										className='mb-1 break-all whitespace-pre-wrap opacity-80'
									>
										{e}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			) : (
				<Text size='s' view='secondary'>
					Нет данных
				</Text>
			)}
		</ModalShell>
	)
}

export default SummaryModal
