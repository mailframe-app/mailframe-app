import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { ProgressLine } from '@consta/uikit/ProgressLine'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants'

import { useImportStatus } from './model/useImportStatus'
import { useInvalidateContacts } from '@/entities/contacts'

type Props = {
	importId: string
}

const STATUS_LABELS: Record<string, string> = {
	PENDING: 'В очереди',
	QUEUED: 'В очереди',
	PROCESSING: 'В работе',
	COMPLETED: 'Завершён',
	FAILED: 'Ошибка'
}

function StatusStep({ importId }: Props) {
	const { importStatus, progress, isLoading } = useImportStatus(importId)
	const navigate = useNavigate()
	const invalidateContacts = useInvalidateContacts()

	const statusLabel = useMemo(() => {
		if (!importStatus?.status) return 'Получение статуса...'
		return STATUS_LABELS[importStatus.status] || importStatus.status
	}, [importStatus])

	if (isLoading && !importStatus) {
		return <SkeletonBrick height={200} />
	}

	return (
		<Card
			verticalSpace='2xl'
			horizontalSpace='2xl'
			className='w-full !rounded-2xl'
		>
			<Layout direction='column' className='w-full'>
				<Text size='2xl' weight='bold' view='primary' className='mb-6'>
					Статус импорта
				</Text>
				<div className='mb-4 flex items-center gap-4'>
					<Text view='primary' size='l'>
						{statusLabel}
					</Text>
					{importStatus?.status === 'COMPLETED' && (
						<Text view='success' size='l'></Text>
					)}
					{importStatus?.status === 'FAILED' && (
						<Text view='alert' size='l'></Text>
					)}
				</div>

				{(importStatus?.status === 'PROCESSING' ||
					importStatus?.status === 'COMPLETED') && (
					<>
						<ProgressLine value={progress} size='m' />
						<Text view='secondary' size='s' className='mt-2'>
							{`Обработано ${
								(importStatus?.successRecords || 0) +
								(importStatus?.failedRecords || 0)
							} из ${importStatus?.totalRecords}`}
						</Text>
					</>
				)}

				<div className='flex justify-center'>
					<div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-3'>
						<InfoBlock
							label='Всего контактов'
							value={importStatus?.totalRecords || 0}
						/>
						<InfoBlock
							label='Успешно'
							value={importStatus?.successRecords || 0}
						/>
						<InfoBlock
							label='Ошибок'
							value={importStatus?.failedRecords || 0}
							view={
								importStatus?.failedRecords && importStatus.failedRecords > 0
									? 'alert'
									: 'primary'
							}
						/>
					</div>
				</div>

				{importStatus?.errors && (
					<div
						className='mt-6 rounded border p-3'
						style={{ borderColor: 'var(--color-bg-border)' }}
					>
						<Text view='alert' size='s'>
							{JSON.stringify(importStatus.errors)}
						</Text>
					</div>
				)}

				{importStatus?.status === 'COMPLETED' && (
					<div className='mt-6 flex w-full justify-center'>
						<Button
							label='Перейти к контактам'
							view='primary'
							onClick={() => {
								invalidateContacts()
								navigate(PRIVATE_ROUTES.CONTACTS)
							}}
						/>
					</div>
				)}
			</Layout>
		</Card>
	)
}

type InfoBlockProps = {
	label: string
	value: number
	view?: 'primary' | 'alert'
}

const InfoBlock = ({ label, value, view = 'primary' }: InfoBlockProps) => (
	<div
		className='rounded border p-3'
		style={{ borderColor: 'var(--color-bg-border)' }}
	>
		<Text view='secondary' size='s'>
			{label}
		</Text>
		<Text view={view} size='2xl' weight='bold' className='mt-1'>
			{value}
		</Text>
	</div>
)

export default StatusStep
