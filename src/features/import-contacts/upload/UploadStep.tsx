import { DragNDropField } from '@consta/uikit/DragNDropField'
import { Text } from '@consta/uikit/Text'
import { useCallback } from 'react'

type Props = {
	acceptedExt: string[]
	maxSize: number
	onFileSelected: (file: File) => void
}

function UploadStep({ acceptedExt, maxSize, onFileSelected }: Props) {
	const onDropFiles = useCallback(
		(files: File[]) => {
			if (!files || files.length === 0) return
			onFileSelected(files[0])
		},
		[onFileSelected]
	)

	return (
		<div className='flex flex-col gap-3'>
			<DragNDropField
				multiple={false}
				accept={acceptedExt}
				maxSize={maxSize}
				onDropFiles={onDropFiles}
			>
				<Text size='s' view='secondary'>
					Перетащите файл сюда или нажмите для выбора
				</Text>
			</DragNDropField>
			<Text size='s' view='secondary'>
				Поддерживаемые форматы: {acceptedExt.join(', ')}. Максимальный размер:{' '}
				{Math.round(maxSize / 1024 / 1024)} МБ.
			</Text>
		</div>
	)
}

export default UploadStep
