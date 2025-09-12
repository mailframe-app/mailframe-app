import { useStorageModalProvider } from '@/features/Storage'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'
import { EmailEditor } from '@/widgets/EmailEditor'
import { Header } from '@/widgets/Header'
import { PreviewOverlay } from '@/widgets/PreviewOverlay'
import { StorageModal } from '@/widgets/StorageWindow'

export const EditorView = () => {
	const { template, isPreviewMode, closePreview } = useEditorTemplateStore()
	const { isModalOpen, closeModal } = useStorageModalProvider()

	return (
		<div className='email-editor'>
			{/* Header */}
			<Header />
			{/* PreviewOverlay */}
			{isPreviewMode && (
				<PreviewOverlay
					htmlContent={template?.bodyHtml || '<div>Нет контента для предпросмотра</div>'}
					onClose={closePreview}
				/>
			)}
			{/* EmailEditor */}
			{!isPreviewMode && <EmailEditor />}
			{/* StorageWindow */}
			<StorageModal isOpen={isModalOpen} onClose={closeModal} />
		</div>
	)
}
