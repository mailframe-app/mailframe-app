import { IconAdd } from '@consta/icons/IconAdd'
import { Button } from '@consta/uikit/Button'
import { Text as CUIText } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useNode } from '@craftjs/core'
import {
	DndContext,
	type DragEndEvent,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import * as React from 'react'

import { useFileUpload } from '@/shared/lib/UploadFile'
import { startFileSelectionHelper } from '@/shared/lib/startFileSelectionHelper'
import type { SelectedFileData } from '@/shared/types'
import { AlignButtons, ImageUpload, PaddingsControl, StepperField } from '@/shared/ui'
import { BackgroundControl } from '@/shared/ui/BackgroundControl'

import {
	ALIGN_OPTIONS,
	DEFAULT_SOCIAL_ICON,
	MAX_ICON_SIZE,
	MIN_ICON_SIZE
} from '../constants.editor'

import type { MjmlSocialBlockProps, SocialItem } from './MjmlSocialBlock.types'
import { SortableSocialItem } from './SortableSocialItem'

interface MjmlSocialBlockSettingsProps {
	startFileSelection?: (callback: (file: SelectedFileData) => void) => void
}

const makeItem = (): SocialItem => ({
	id: Math.random().toString(36).slice(2),
	name: 'Social',
	href: '',
	src: DEFAULT_SOCIAL_ICON,
	alt: ''
})

export const MjmlSocialBlockSettings: React.FC<MjmlSocialBlockSettingsProps> = ({
	startFileSelection
}) => {
	const {
		actions: { setProp },
		items,
		selectedIndex,
		background = '#FFFFFF',
		size = 32,
		gap = 10,
		align = 'left',
		paddingTop = '0px',
		paddingRight = '0px',
		paddingBottom = '0px',
		paddingLeft = '0px'
	} = useNode<MjmlSocialBlockProps>(node => ({
		items: node.data.props.items,
		selectedIndex: node.data.props.selectedIndex,
		size: node.data.props.size,
		gap: node.data.props.gap,
		align: node.data.props.align,
		background: node.data.props.background,
		paddingTop: node.data.props.paddingTop,
		paddingRight: node.data.props.paddingRight,
		paddingBottom: node.data.props.paddingBottom,
		paddingLeft: node.data.props.paddingLeft
	}))

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

	const isItemSelected =
		typeof selectedIndex === 'number' && selectedIndex >= 0 && selectedIndex < items.length
	const safeIndex = isItemSelected ? selectedIndex : -1
	const selected = isItemSelected ? items[safeIndex] : undefined

	const { upload, isLoading: isUploadingToServer } = useFileUpload()

	// UI для секции «Иконка»
	const [uploading, setUploading] = React.useState(false)
	const [openUploader, setOpenUploader] = React.useState(false)
	const uploadRef = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		if (!isItemSelected) setOpenUploader(false)
	}, [isItemSelected])

	React.useEffect(() => {
		if (!openUploader) return
		const onDown = (e: MouseEvent) => {
			if (uploadRef.current && !uploadRef.current.contains(e.target as Node)) {
				setOpenUploader(false)
			}
		}
		document.addEventListener('mousedown', onDown)
		return () => document.removeEventListener('mousedown', onDown)
	}, [openUploader])

	React.useEffect(() => {
		setOpenUploader(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [safeIndex, isItemSelected && items[safeIndex!]?.id])

	const handleAdd = () => {
		setProp((p: MjmlSocialBlockProps) => {
			p.items = [...(p.items || []), makeItem()]
			const len = p.items?.length ?? 0
			p.selectedIndex = len ? len - 1 : -1
		})
	}

	const handleRemoveAt = (removeIndex?: number) => {
		setProp((p: MjmlSocialBlockProps) => {
			const items = p.items || []
			if (items.length === 0) return

			const idx = typeof removeIndex === 'number' ? removeIndex : (p.selectedIndex ?? -1)
			if (idx < 0 || idx >= items.length) return

			const nextItems = items.filter((_, i) => i !== idx)
			const prevSel = typeof p.selectedIndex === 'number' ? p.selectedIndex : -1
			let nextSel = prevSel

			if (prevSel === idx) {
				nextSel = nextItems.length ? Math.min(idx, nextItems.length - 1) : -1
			} else if (idx < prevSel) {
				nextSel = prevSel - 1
			}

			p.items = nextItems
			p.selectedIndex = nextSel
		})
	}

	const handleSelectAt = (idx: number) => {
		setProp((p: MjmlSocialBlockProps) => {
			p.selectedIndex = idx
		})
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return

		const oldIndex = items.findIndex(i => i.id === active.id)
		const newIndex = items.findIndex(i => i.id === over.id)
		if (oldIndex === -1 || newIndex === -1) return

		setProp((p: MjmlSocialBlockProps) => {
			p.items = arrayMove(p.items || [], oldIndex, newIndex)

			const si = typeof p.selectedIndex === 'number' ? p.selectedIndex : -1
			if (si < 0) return
			if (si === oldIndex) {
				p.selectedIndex = newIndex
			} else if (oldIndex < si && newIndex >= si) {
				p.selectedIndex = si - 1
			} else if (oldIndex > si && newIndex <= si) {
				p.selectedIndex = si + 1
			}
		})
	}

	const handleLocalFile = async (file: File) => {
		setUploading(true)
		try {
			if (!upload) throw new Error('Загрузка на сервер недоступна')

			const up = await upload(file)
			if (!up) throw new Error('Файл не прошёл проверку или загрузку на сервер')

			setProp((p: MjmlSocialBlockProps) => {
				if (!p.items?.[safeIndex]) return
				p.items[safeIndex] = { ...p.items[safeIndex], src: up.url, alt: up.name ?? file.name }
			})
			setOpenUploader(false)
		} catch (e) {
			console.error(e)
		} finally {
			setUploading(false)
		}
	}

	const handleSelectFromLibrary = () => {
		startFileSelectionHelper(startFileSelection, file => {
			setProp((p: MjmlSocialBlockProps) => {
				if (!p.items?.[safeIndex]) return
				p.items[safeIndex] = {
					...p.items[safeIndex],
					src: file.url,
					alt: file.name || p.items[safeIndex].alt || ''
				}
			})
			setOpenUploader(false)
		})
	}

	const renderIconSection = () => {
		if (!selected?.src) {
			return (
				<div ref={uploadRef}>
					<ImageUpload
						isLoading={uploading || isUploadingToServer}
						onLibrarySelect={handleSelectFromLibrary}
						onFileSelect={handleLocalFile}
					/>
				</div>
			)
		}

		return (
			<div className='space-y-2'>
				<div className='flex items-center justify-between'>
					<CUIText size='s' view='success'>
						Добавлено!
					</CUIText>
					<img
						src={selected.src}
						alt={selected.alt || selected.name || 'icon'}
						style={{ width: 32, height: 32, borderRadius: 4, display: 'block' }}
						draggable={false}
					/>
					<Button
						view='secondary'
						size='s'
						label='Заменить'
						onClick={() => setOpenUploader(v => !v)}
						disabled={uploading || isUploadingToServer}
					/>
				</div>

				{openUploader && (
					<div ref={uploadRef}>
						<ImageUpload
							isLoading={uploading || isUploadingToServer}
							onLibrarySelect={handleSelectFromLibrary}
							onFileSelect={handleLocalFile}
						/>
					</div>
				)}
			</div>
		)
	}

	const [sizeInput, setSizeInput] = React.useState(String(size))
	React.useEffect(() => setSizeInput(String(size)), [size])

	const handleSizeInput = (n: number) => {
		const value = Math.max(MIN_ICON_SIZE, Math.min(MAX_ICON_SIZE, n))
		setProp((p: MjmlSocialBlockProps) => {
			p.size = value
		})
	}

	const handleSizeInputRaw = (v: string | number) => {
		setSizeInput(String(v ?? ''))
	}

	const handleSizeBlur = () => {
		const n = parseInt(sizeInput, 10)
		if (!isNaN(n) && n >= MIN_ICON_SIZE && n <= MAX_ICON_SIZE) {
			setProp((p: MjmlSocialBlockProps) => {
				p.size = n
			})
		} else {
			setSizeInput(String(size))
		}
	}

	const handleSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSizeBlur()
	}

	const urlValue = selected?.href ?? ''
	const isUrlEmpty = urlValue.trim().length === 0

	return (
		<div className='space-y-4'>
			{/* Добавить соцсеть */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='text-gray-500'>
					Добавить соцсеть
				</CUIText>
				<Button view='ghost' size='s' iconLeft={IconAdd} onClick={handleAdd} />
			</div>

			{/* Сортируемый список */}
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
					<div className='space-y-2'>
						{items.map((it, idx) => (
							<SortableSocialItem
								key={it.id}
								item={it}
								active={idx === safeIndex}
								onSelect={() => handleSelectAt(idx)}
								onRemove={() => handleRemoveAt(idx)}
							/>
						))}
						{items.length === 0 && (
							<CUIText size='xs' view='secondary'>
								Нет элементов — добавьте первую соцсеть.
							</CUIText>
						)}
					</div>
				</SortableContext>
			</DndContext>

			{/* Поля конкретного элемента: показывать ТОЛЬКО если выбран элемент */}
			{isItemSelected && (
				<>
					{/* URL */}
					<div className='flex items-center justify-between'>
						<CUIText size='s' weight='light' className='w-[80px] truncate text-gray-500'>
							URL <span className='text-red-500'>*</span>
						</CUIText>
						<TextField
							value={urlValue}
							onChange={value =>
								setProp((p: MjmlSocialBlockProps) => {
									if (safeIndex < 0 || !p.items?.[safeIndex]) return
									p.items[safeIndex] = { ...p.items[safeIndex], href: value || '' }
								})
							}
							size='s'
							view='clear'
							className={`rounded-lg bg-[#F3F5F7] pl-[15px] ${
								isUrlEmpty ? 'outline outline-[#F33]' : ''
							}`}
							placeholder='Введите ссылку'
							aria-invalid={isUrlEmpty}
						/>
					</div>

					{/* ALT */}
					<div className='flex items-center justify-between'>
						<CUIText size='s' weight='light' className='w-[80px] truncate text-gray-500'>
							Alt текст
						</CUIText>
						<TextField
							value={selected?.alt ?? ''}
							onChange={value =>
								setProp((p: MjmlSocialBlockProps) => {
									if (safeIndex < 0 || !p.items?.[safeIndex]) return
									p.items[safeIndex] = { ...p.items[safeIndex], alt: value || '' }
								})
							}
							size='s'
							view='clear'
							className='rounded-lg bg-[#F3F5F7] pl-[15px]'
							placeholder='Введите описание'
						/>
					</div>

					{/* Иконка */}
					<div className='space-y-2'>
						<CUIText size='s' weight='light' className='text-gray-500'>
							Иконка
						</CUIText>
						{renderIconSection()}
					</div>
				</>
			)}

			{/* Фон блока — всегда */}
			<BackgroundControl
				value={background}
				onChange={v =>
					setProp((p: MjmlSocialBlockProps) => {
						p.background = v
					})
				}
			/>

			{/* Размер иконки */}
			<div className='flex items-center justify-between'>
				<div className='flex>'>
					<CUIText size='s' weight='light' className='text-gray-500'>
						Размер иконки
					</CUIText>
					<CUIText size='xs' view='secondary' className='whitespace-nowrap'>
						от {MIN_ICON_SIZE} до {MAX_ICON_SIZE}
					</CUIText>
				</div>

				<div className='flex items-center gap-2'>
					<StepperField
						label=''
						value={sizeInput}
						min={MIN_ICON_SIZE}
						max={MAX_ICON_SIZE}
						step={1}
						onChange={handleSizeInput}
						onChangeRaw={handleSizeInputRaw}
						onBlur={handleSizeBlur}
						onKeyDown={handleSizeKeyDown}
					/>
				</div>
			</div>

			{/* Отступы между иконками */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='text-gray-500'>
					Отступы между иконками
				</CUIText>
				<StepperField
					label=''
					value={String(gap)}
					onChange={n =>
						setProp((p: MjmlSocialBlockProps) => {
							p.gap = Number(n || 0) || 0
						})
					}
					min={0}
					max={64}
					step={1}
				/>
			</div>

			{/* Выравнивание */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='text-gray-500'>
					Выравнивание
				</CUIText>
				<AlignButtons
					options={ALIGN_OPTIONS}
					value={align}
					onChange={newAlign =>
						setProp((p: MjmlSocialBlockProps) => {
							p.align = newAlign
						})
					}
				/>
			</div>

			{/* Padding */}
			<div>
				<PaddingsControl
					value={{ paddingTop, paddingRight, paddingBottom, paddingLeft }}
					onChange={pad =>
						setProp((p: MjmlSocialBlockProps) => {
							p.paddingTop = pad.paddingTop
							p.paddingRight = pad.paddingRight
							p.paddingBottom = pad.paddingBottom
							p.paddingLeft = pad.paddingLeft
						})
					}
				/>
			</div>
		</div>
	)
}
