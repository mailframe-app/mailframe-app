import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { useLayoutEffect } from 'react'

import { StorageModalContent } from './StorageModalContent'
import { StorageModalHeader } from './StorageModalHeader'
import { StorageModalNavigation } from './StorageModalNavigation'
import { StorageProvider, useStorageStore } from '@/entities/Storage'

// Компонент-обертка для инициализации данных
const StorageInitializer = ({ isOpen }: { isOpen: boolean }) => {
	const { activeView, fetchStorageItems, fetchTrashedFiles, fetchStorageStats, fetchFolderTree } =
		useStorageStore()

	// При открытии модалки загружаем данные
	useLayoutEffect(() => {
		if (!isOpen) return

		const loadItems = activeView === 'trash' ? fetchTrashedFiles() : fetchStorageItems()
		void Promise.all([loadItems, fetchStorageStats(), fetchFolderTree()])
	}, [isOpen])

	return null
}

export const StorageModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	return (
		<StorageProvider value={{ activeView: 'files' }}>
			<StorageInitializer isOpen={isOpen} />
			<Modal
				isOpen={isOpen}
				hasOverlay
				onEsc={onClose}
				className='h-[80vh] w-[80vw]'
				style={{ zIndex: 9999 }}
			>
				<Layout direction='column' className='h-full w-full'>
					<StorageModalHeader onClose={onClose} />
					<Layout direction='row' className='h-full w-full overflow-hidden'>
						<StorageModalNavigation />
						<StorageModalContent />
					</Layout>
				</Layout>
			</Modal>
		</StorageProvider>
	)
}
