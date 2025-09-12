import { Button } from '@consta/uikit/Button'
import { Checkbox } from '@consta/uikit/Checkbox'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useState } from 'react'

import ModalShell from '@/shared/ui/Modals/ModalShell'

import { useCloneGroup } from '../model/useCloneGroup'

export type CloneGroupModalProps = {
	isOpen: boolean
	onClose: () => void
	source: { id: string; name: string }
	defaultName?: string
	defaultIncludeMembers?: boolean
	onCloned?: (res?: any) => void
}

export function CloneGroupModal({
	isOpen,
	onClose,
	source,
	defaultName,
	defaultIncludeMembers = true,
	onCloned
}: CloneGroupModalProps) {
	const [name, setName] = useState(defaultName || `${source.name} (копия)`)
	const [includeMembers, setIncludeMembers] = useState<boolean>(
		defaultIncludeMembers
	)
	const { clone, isPending } = useCloneGroup()

	useEffect(() => {
		setName(defaultName || `${source.name} (копия)`)
	}, [defaultName, source.name])

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button
				view='ghost'
				label='Отмена'
				onClick={onClose}
				disabled={isPending}
			/>
			<Button
				view='primary'
				label='Дублировать'
				onClick={async () => {
					const res = await clone({
						id: source.id,
						newName: name.trim(),
						includeMembers,
						sourceName: source.name
					})
					onCloned?.(res)
					onClose()
				}}
				loading={isPending}
				disabled={!name.trim()}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Дублировать группу'
			footer={footer}
		>
			<div className='grid grid-cols-1 gap-3'>
				<div>
					<Text size='s' view='secondary' className='mb-1'>
						Новое имя группы
					</Text>
					<TextField
						value={name}
						onChange={v => setName((v as string) || '')}
						size='m'
						autoFocus
					/>
				</div>
				<div>
					<Checkbox
						checked={includeMembers}
						onChange={() => setIncludeMembers(v => !v)}
						label='Копировать участников'
						size='s'
					/>
					<Text size='xs' view='secondary'>
						При включении все участники исходной группы будут скопированы в
						новую.
					</Text>
				</div>
			</div>
		</ModalShell>
	)
}
