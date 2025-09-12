import type { IconComponent } from '@consta/icons/Icon'
import { IconCode } from '@consta/icons/IconCode'
import { IconDocFilled } from '@consta/icons/IconDocFilled'
import { IconPhoto } from '@consta/icons/IconPhoto'
import { Button } from '@consta/uikit/Button'
import { Checkbox } from '@consta/uikit/Checkbox'
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup'
import { Combobox } from '@consta/uikit/Combobox'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'

interface ExportTemplateModalProps {
	isOpen: boolean
	onClose: () => void
}

type ItemProps = {
	label: string
	value: string
	icon: IconComponent
}

const exportOptions: ItemProps[] = [
	{ label: 'HTML', value: 'html', icon: IconCode },
	{ label: 'PDF', value: 'pdf', icon: IconDocFilled },
	{ label: 'PNG', value: 'png', icon: IconPhoto }
]

const pdfPageSizes = [
	{ label: 'A4', value: 'a4' },
	{ label: 'Letter', value: 'letter' }
]

const pdfOrientations = [
	{ label: 'Книжная', value: 'portrait' },
	{ label: 'Альбомная', value: 'landscape' }
]

export const ExportTemplateModal: React.FC<ExportTemplateModalProps> = ({ isOpen, onClose }) => {
	const [format, setFormat] = useState(exportOptions[0])
	const [minifyHtml, setMinifyHtml] = useState(false)
	const [pageSize, setPageSize] = useState(pdfPageSizes[0])
	const [orientation, setOrientation] = useState(pdfOrientations[0])

	const handleClose = () => {
		setFormat(exportOptions[0])
		setMinifyHtml(false)
		setPageSize(pdfPageSizes[0])
		setOrientation(pdfOrientations[0])
		onClose()
	}

	const renderOptions = () => {
		switch (format.value) {
			case 'html':
				return (
					<Checkbox
						label='Минифицировать HTML'
						checked={minifyHtml}
						onChange={() => setMinifyHtml(!minifyHtml)}
					/>
				)
			case 'pdf':
				return (
					<div className='flex gap-4'>
						<Combobox
							label='Размер страницы'
							items={pdfPageSizes}
							value={pageSize}
							getItemKey={item => item.value}
							getItemLabel={item => item.label}
							onChange={item => item && setPageSize(item)}
							className='w-1/2'
							size='s'
						/>
						<Combobox
							label='Ориентация'
							items={pdfOrientations}
							value={orientation}
							getItemKey={item => item.value}
							getItemLabel={item => item.label}
							onChange={item => item && setOrientation(item)}
							className='w-1/2'
							size='s'
						/>
					</div>
				)
			case 'png':
				return <Text view='secondary'>Дополнительные настройки для PNG появятся в будущем.</Text>
			default:
				return null
		}
	}

	return (
		<Modal isOpen={isOpen} onClickOutside={handleClose} onEsc={handleClose} hasOverlay>
			<Layout direction='column' className='p-6' style={{ width: '500px' }}>
				<Text size='xl' weight='bold' className='mb-4'>
					Экспорт шаблона
				</Text>

				<div className='mb-6'>
					<Layout className='justify-center'>
						<ChoiceGroup
							value={format}
							onChange={item => item && setFormat(item)}
							items={exportOptions}
							getItemLabel={item => item.label}
							getItemIcon={item => item.icon}
							name='export-format'
							size='m'
							view='primary'
						/>
					</Layout>
				</div>

				<div className='mb-8 min-h-[60px]'>
					<Text as='p' weight='medium' className='mb-2'>
						Настройки
					</Text>
					{renderOptions()}
				</div>

				<Layout direction='row' className='justify-end gap-2'>
					<Button label='Отмена' view='ghost' onClick={handleClose} />
					<Button label='Экспорт' view='primary' disabled />
				</Layout>
			</Layout>
		</Modal>
	)
}
