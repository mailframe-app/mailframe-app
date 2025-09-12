import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react'

import { useDeleteTemplateModal } from '../DeleteTemplate/model/useDeleteTemplateModal'
import { useDuplicateTemplateModal } from '../DuplicateTemplate/model/useDuplicateTemplateModal'
import { useExportTemplateModal } from '../ExportTemplate/model/useExportTemplateModal'
import { useRenameModal } from '../RenameTemplate/model/useRenameModal'
import { useSendTestEmailModal } from '../SendTestMail/model/useSendTestEmailModal'
import { menuItems } from '../constants/actions.constants'

export type MenuActionId = (typeof menuItems)[number]['id']

export const useTemplateActionsMenu = () => {
	const menuAnchorRef = useRef<HTMLButtonElement>(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const {
		isModalOpen: isRenameOpen,
		openModal: openRename,
		closeModal: closeRename
	} = useRenameModal()
	const {
		isModalOpen: isSendTestOpen,
		openModal: openSendTest,
		closeModal: closeSendTest
	} = useSendTestEmailModal()
	const {
		isModalOpen: isExportOpen,
		openModal: openExport,
		closeModal: closeExport
	} = useExportTemplateModal()
	const {
		isModalOpen: isDuplicateOpen,
		openModal: openDuplicate,
		closeModal: closeDuplicate
	} = useDuplicateTemplateModal()
	const { openModal: openDelete } = useDeleteTemplateModal()

	const closeMenu = useCallback(() => setIsMenuOpen(false), [])
	const toggleMenu = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsMenuOpen(prev => !prev)
	}, [])

	const actionHandlers: Record<MenuActionId, () => void> = useMemo(
		() => ({
			sendTestEmail: () => {
				closeMenu()
				openSendTest()
			},
			export: () => {
				closeMenu()
				openExport()
			},
			rename: () => {
				closeMenu()
				openRename()
			},
			copy: () => {
				closeMenu()
				openDuplicate()
			},
			delete: () => {
				closeMenu()
				openDelete()
			},
			close: () => {
				closeMenu()
				window.location.href = '/templates'
			}
		}),
		[closeMenu, openSendTest, openExport, openRename, openDuplicate, openDelete]
	)

	const handleItemClick = useCallback(
		(item: (typeof menuItems)[number]) => {
			const handler = actionHandlers[item.id as MenuActionId]
			if (handler) handler()
		},
		[actionHandlers]
	)

	const RenameTemplateModal = useMemo(
		() =>
			React.lazy(() =>
				import('../RenameTemplate/ui/RenameTemplateModal').then(m => ({
					default: m.RenameTemplateModal
				}))
			),
		[]
	)
	const SendTestEmailModal = useMemo(
		() =>
			React.lazy(() =>
				import('../SendTestMail/ui/SendTestEmailModal').then(m => ({
					default: m.SendTestEmailModal
				}))
			),
		[]
	)
	const ExportTemplateModal = useMemo(
		() =>
			React.lazy(() =>
				import('../ExportTemplate/ui/ExportTemplateModal').then(m => ({
					default: m.ExportTemplateModal
				}))
			),
		[]
	)
	const DuplicateTemplateModal = useMemo(
		() =>
			React.lazy(() =>
				import('../DuplicateTemplate/ui/DuplicateTemplateModal').then(m => ({
					default: m.DuplicateTemplateModal
				}))
			),
		[]
	)

	const LazyModals: React.FC = useCallback(() => {
		return (
			<Suspense fallback={null}>
				<RenameTemplateModal isOpen={isRenameOpen} onClose={closeRename} />
				<SendTestEmailModal isOpen={isSendTestOpen} onClose={closeSendTest} />
				<ExportTemplateModal isOpen={isExportOpen} onClose={closeExport} />
				<DuplicateTemplateModal isOpen={isDuplicateOpen} onClose={closeDuplicate} />
			</Suspense>
		)
	}, [
		RenameTemplateModal,
		SendTestEmailModal,
		ExportTemplateModal,
		DuplicateTemplateModal,
		isRenameOpen,
		closeRename,
		isSendTestOpen,
		closeSendTest,
		isExportOpen,
		closeExport,
		isDuplicateOpen,
		closeDuplicate
	])

	return {
		isMenuOpen,
		toggleMenu,
		closeMenu,
		menuAnchorRef,
		items: [...menuItems],
		handleItemClick,
		LazyModals
	}
}
