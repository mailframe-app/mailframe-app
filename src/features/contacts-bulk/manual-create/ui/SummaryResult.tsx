import { Text } from '@consta/uikit/Text'
import React from 'react'

export type Summary = {
	success: boolean
	processed: number
	failed: number
	errors?: string[]
}

type Props = {
	summary?: Summary
}

export const SummaryResult: React.FC<Props> = ({ summary }) => {
	if (!summary) {
		return (
			<Text size='s' view='secondary'>
				Нет данных
			</Text>
		)
	}
	return (
		<div className='flex flex-col gap-3'>
			<div className='grid grid-cols-1 gap-1 text-sm md:grid-cols-3'>
				<div>
					<Text size='s' view='secondary'>
						Успешно:
					</Text>{' '}
					<Text size='s' view='primary'>
						{summary.processed}
					</Text>
				</div>
				<div>
					<Text size='s' view='secondary'>
						Ошибки:
					</Text>{' '}
					<Text size='s' view='primary'>
						{summary.failed}
					</Text>
				</div>
				<div>
					<Text size='s' view='secondary'>
						Статус:
					</Text>{' '}
					<Text size='s' view='primary'>
						{summary.success ? 'OK' : 'Ошибка'}
					</Text>
				</div>
			</div>
			{Array.isArray(summary.errors) && summary.errors.length > 0 && (
				<div>
					<Text size='s' view='secondary'>
						Ошибки
					</Text>
					<div
						className='mt-2 max-h-64 overflow-auto rounded p-2 text-xs'
						style={{
							border: '1px solid var(--color-bg-border)'
						}}
					>
						{summary.errors.map((e, idx) => (
							<div
								key={idx}
								className='mb-1 break-all whitespace-pre-wrap opacity-80'
							>
								<Text size='s' view='secondary'>
									{e}
								</Text>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
