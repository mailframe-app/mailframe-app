import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { CloneGroupModal } from '@/features/contacts-groups/group-clone'
import { CreateGroupModal } from '@/features/contacts-groups/group-create'
import { DeleteGroupsModal } from '@/features/contacts-groups/group-delete'
import { EditGroupModal } from '@/features/contacts-groups/group-edit'
import { MergeGroupsModal } from '@/features/contacts-groups/group-merge'

import type { GroupResponseDto } from '@/entities/contacts'

export type GroupsTabModalsHandle = {
	openCreate: () => void
	openEdit: (group: GroupResponseDto) => void
	openDelete: (ids: string[], name?: string) => void
	openClone: (source: { id: string; name: string }) => void
	openMerge: () => void
	closeAll: () => void
}

export type GroupsTabModalsProps = {
	items: GroupResponseDto[]
	selectedIds: Set<string>
	onClearSelection: () => void
}

const GroupsTabModals = forwardRef<GroupsTabModalsHandle, GroupsTabModalsProps>(
	({ items, selectedIds, onClearSelection }, ref) => {
		// Create/Edit state
		type EditorState =
			| { mode: 'create' }
			| { mode: 'edit'; group: GroupResponseDto }
			| null
		const [editor, setEditor] = useState<EditorState>(null)

		// Delete state
		const [deleteConfirm, setDeleteConfirm] = useState<{
			isOpen: boolean
			ids: string[]
			name?: string
		} | null>(null)

		// Clone state
		const [cloneModal, setCloneModal] = useState<{
			isOpen: boolean
			source?: { id: string; name: string }
		} | null>(null)

		// Merge state
		const [isMergeOpen, setIsMergeOpen] = useState(false)

		// Провайдим методы для открытия модальных окон
		useImperativeHandle(ref, () => ({
			openCreate: () => setEditor({ mode: 'create' }),
			openEdit: (group: GroupResponseDto) => setEditor({ mode: 'edit', group }),
			openDelete: (ids: string[], name?: string) =>
				setDeleteConfirm({ isOpen: true, ids, name }),
			openClone: (source: { id: string; name: string }) =>
				setCloneModal({ isOpen: true, source }),
			openMerge: () => setIsMergeOpen(true),
			closeAll: () => {
				setEditor(null)
				setDeleteConfirm(null)
				setCloneModal(null)
				setIsMergeOpen(false)
			}
		}))

		const mergeItems = useMemo(
			() =>
				items
					.filter(g => selectedIds.has(g.id))
					.map(g => ({ id: g.id, name: g.name })),
			[items, selectedIds]
		)

		return (
			<>
				{/* Create/Edit group */}
				{editor?.mode === 'create' && (
					<CreateGroupModal isOpen onClose={() => setEditor(null)} />
				)}
				{editor?.mode === 'edit' && (
					<EditGroupModal
						isOpen
						onClose={() => setEditor(null)}
						groupId={editor.group.id}
						initial={{
							name: editor.group.name,
							description: editor.group.description
						}}
					/>
				)}

				{/* Delete group */}
				{deleteConfirm?.isOpen && (
					<DeleteGroupsModal
						isOpen
						onClose={() => {
							setDeleteConfirm(null)
							onClearSelection()
						}}
						groupIds={deleteConfirm.ids}
						groupName={deleteConfirm.name}
					/>
				)}

				{/* Clone group */}
				{cloneModal?.isOpen && cloneModal.source && (
					<CloneGroupModal
						isOpen
						onClose={() => setCloneModal(null)}
						source={cloneModal.source}
						defaultName={`${cloneModal.source.name} (копия)`}
						defaultIncludeMembers
					/>
				)}

				{/* Merge groups */}
				{isMergeOpen && (
					<MergeGroupsModal
						isOpen
						onClose={() => {
							setIsMergeOpen(false)
							onClearSelection()
						}}
						items={mergeItems}
					/>
				)}
			</>
		)
	}
)

export default GroupsTabModals
