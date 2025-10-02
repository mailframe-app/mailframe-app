import { Button } from '@consta/uikit/Button'
import { Grid, GridItem } from '@consta/uikit/Grid'
import { useState } from 'react'

import ModalShell from '@/shared/ui/Modals/ModalShell'

import { useContactRowEdit } from '../model/useContactRowEdit'

import { ContactEditForm } from './ContactEditForm'
import { ContactEmailStats } from './ContactEmailStats'
import { ContactGroupsManager } from './ContactGroupsManager'
import type { ContactListItemDto, GroupResponseDto } from '@/entities/contacts'

export type EditContactModalProps = {
	isOpen: boolean
	onClose: () => void
	contact: ContactListItemDto
	onUpdated?: () => void
}

export function EditContactModal({
	isOpen,
	onClose,
	contact,
	onUpdated
}: EditContactModalProps) {
	// Состояние выбранных групп - инициализируем из contact.groups
	const [selectedGroups, setSelectedGroups] = useState<GroupResponseDto[]>(
		((contact as any).groups || []).map((group: any) => ({
			id: group.id,
			name: group.name,
			color: group.color || undefined,
			description: undefined,
			createdAt: '',
			updatedAt: '',
			stats: { contactsCount: 0, lastUpdated: '' }
		}))
	)

	// Hook управления редактированием
	const {
		formData,
		handleChange,
		handleSave,
		handleCancel,
		isDirty,
		isLoading
	} = useContactRowEdit(
		contact,
		true, // всегда в режиме редактирования
		() => {
			onUpdated?.()
			onClose()
		},
		selectedGroups
	)

	// Обработчик сохранения с закрытием модального окна
	const handleSaveAndClose = async () => {
		try {
			await handleSave()
			// handleSave уже вызывает onUpdated и onClose через useContactRowEdit
		} catch (error) {
			// Ошибка уже обработана в handleSave
		}
	}

	// Обработчик отмены с закрытием модального окна
	const handleCancelAndClose = () => {
		handleCancel()
		// handleCancel уже вызывает onClose через useContactRowEdit
	}

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button
				view='ghost'
				label='Отмена'
				onClick={handleCancelAndClose}
				disabled={isLoading}
			/>
			<Button
				view='primary'
				label='Сохранить'
				loading={isLoading}
				disabled={!isDirty}
				onClick={handleSaveAndClose}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Редактировать контакт'
			footer={footer}
		>
			<Grid cols={12} gap='m'>
				{/* Левая колонка: Форма редактирования */}
				<GridItem col={6}>
					<ContactEditForm
						contact={contact}
						formData={formData}
						onChange={handleChange}
					/>
				</GridItem>

				{/* Правая колонка: Группы и статистика */}
				<GridItem col={6}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'var(--space-m)'
						}}
					>
						{/* ContactGroupsManager - управление группами */}
						<ContactGroupsManager
							contactId={contact.id}
							currentGroups={selectedGroups}
							onChange={setSelectedGroups}
						/>
						{/* ContactEmailStats - статистика email */}
						<ContactEmailStats contactId={contact.id} />
					</div>
				</GridItem>
			</Grid>
		</ModalShell>
	)
}

export default EditContactModal
