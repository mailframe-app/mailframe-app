import { Button } from '@consta/uikit/Button'
import { DragNDropField } from '@consta/uikit/DragNDropField'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'

import { formatFileSize } from '@/entities/Storage'

interface UploadFilesModalProps {
	isOpen: boolean
	onClose: () => void
	loading: boolean
	files: File[]
	error: string | null
	onDropFiles: (files: File[]) => void
	onRemoveFile: (index: number) => void
	onUpload: () => Promise<boolean>
}

export const UploadFilesModal = ({
	isOpen,
	onClose,
	loading,
	files,
	error,
	onDropFiles,
	onRemoveFile,
	onUpload
}: UploadFilesModalProps) => {
	const handleSubmit = async () => {
		await onUpload()
	}

	return (
		<Modal isOpen={isOpen} onEsc={onClose} hasOverlay onClickOutside={onClose}>
			<Layout direction='column' className='p-6' style={{ width: '600px' }}>
				<Text size='xl' weight='bold' className='mb-4'>
					Загрузить файлы
				</Text>

				<DragNDropField
					onDropFiles={onDropFiles}
					multiple
					className='mb-4'
					accept={[
						'image/*',
						'.pdf',
						'.doc',
						'.docx',
						'.xls',
						'.xlsx',
						'.txt',
						'.csv',
						'.zip',
						'.rar',
						'.7z'
					]}
				>
					{({ openFileDialog }) => (
						<div className='p-4'>
							{files.length === 0 ? (
								<div className='flex flex-col items-center justify-center p-8'>
									<Text size='l' view='secondary' className='mb-2'>
										Перетащите файлы сюда
									</Text>
									<Text size='s' view='secondary' className='mb-2'>
										или нажмите для выбора
									</Text>
									<Text size='s' view='secondary' className='mb-4'>
										Максимальный размер файла: 20 МБ
									</Text>
									<Button label='Выбрать файлы' onClick={openFileDialog} />
								</div>
							) : (
								<div>
									<div className='mb-4 flex items-center justify-between'>
										<Text size='s' view='secondary'>
											Выбрано файлов: {files.length}
										</Text>
										<Button size='xs' label='Добавить ещё' onClick={openFileDialog} />
									</div>
									<div className='max-h-[200px] overflow-y-auto'>
										{files.map((file, index) => (
											<div
												key={index}
												className='flex items-center justify-between rounded-md p-2 hover:bg-gray-50'
											>
												<div className='flex items-center gap-2'>
													<Text size='s'>{file.name}</Text>
													<Text size='xs' view='secondary'>
														({formatFileSize(file.size)})
													</Text>
												</div>
												<Button
													size='xs'
													view='clear'
													label='Удалить'
													onClick={() => onRemoveFile(index)}
													disabled={loading}
												/>
											</div>
										))}
									</div>
								</div>
							)}
							{error && (
								<Text size='s' view='alert' className='mt-2'>
									{error}
								</Text>
							)}
						</div>
					)}
				</DragNDropField>

				<Layout direction='row' className='justify-end gap-2'>
					<Button label='Отмена' view='ghost' onClick={onClose} disabled={loading} />
					<Button label='Загрузить' onClick={handleSubmit} loading={loading} />
				</Layout>
			</Layout>
		</Modal>
	)
}
