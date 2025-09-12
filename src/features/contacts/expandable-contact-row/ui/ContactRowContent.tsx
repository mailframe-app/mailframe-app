import { Grid, GridItem } from '@consta/uikit/Grid'
import { useState } from 'react'

import { DeleteContactsModal } from '../../contact-delete/ui/DeleteContactsModal'
import { useContactRowEdit } from '../model/useContactRowEdit'

import { ContactEditForm } from './ContactEditForm'
import { ContactEditHeader } from './ContactEditHeader'
import { ContactEmailStats } from './ContactEmailStats'
import { ContactGroupsManager } from './ContactGroupsManager'
import type { ContactListItemDto, GroupResponseDto } from '@/entities/contacts'

interface ContactRowContentProps {
	contact: ContactListItemDto
	onClose: () => void
}

export const ContactRowContent: React.FC<ContactRowContentProps> = ({
	contact,
	onClose
}) => {
	// Состояние режима редактирования
	const [isEditing, setIsEditing] = useState(true) // Всегда в режиме редактирования

	// Состояние модального окна удаления
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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
		handleDelete,
		isDirty,
		isLoading
	} = useContactRowEdit(
		contact,
		isEditing,
		() => {
			setIsEditing(false)
			onClose()
		},
		selectedGroups
	)

	// Обработчик открытия модального окна удаления
	const handleDeleteClick = () => {
		setIsDeleteModalOpen(true)
	}

	// Обработчик подтвержденного удаления
	const handleDeleteConfirmed = () => {
		handleDelete()
		setIsDeleteModalOpen(false)
	}

	return (
		<div
			style={{
				padding: 'var(--space-m)',
				backgroundColor: 'var(--color-bg-secondary)',
				borderTop: '1px solid var(--color-bg-border)',
				borderRadius: 'var(--control-radius)'
			}}
		>
			<Grid cols={12} gap='m'>
				{/* Левая колонка: Форма редактирования */}
				<GridItem col={6}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'var(--space-m)'
						}}
					>
						{/* ContactEditForm - форма редактирования */}
						<ContactEditForm
							contact={contact}
							formData={formData}
							onChange={handleChange}
							headerActions={
								<ContactEditHeader
									isDirty={isDirty}
									isLoading={isLoading}
									onSave={handleSave}
									onCancel={handleCancel}
									onDelete={handleDeleteClick}
								/>
							}
						/>
					</div>
				</GridItem>

				{/* Правая колонка: Статистика */}
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

			{/* Модальное окно подтверждения удаления */}
			<DeleteContactsModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				contactIds={[contact.id]}
				contactTitle={contact.email}
				onDeleted={handleDeleteConfirmed}
			/>
		</div>
	)
}
