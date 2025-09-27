import { IconSave } from '@consta/icons/IconSave'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { isEqual } from 'lodash'
import { useState } from 'react'

import { TagSelector } from '@/features/templates-actions/manage-tags'
import { useTagManagement } from '@/features/templates-actions/manage-tags/model/useTagManagement'
import { useOpenTemplateAction } from '@/features/templates-actions/open-template'
import { EditableTemplateName } from '@/features/templates-actions/rename-template'

import { showCustomToast } from '@/shared/lib'
import { formatDate } from '@/shared/lib/formatDate'

import { type TagResponse } from '@/entities/template-tags'
import { type TemplateListItem, useUpdateTemplate } from '@/entities/templates'

interface TemplatePreviewProps {
	template: TemplateListItem
	onClose: () => void
}

export function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
	const { handleOpen } = useOpenTemplateAction()
	const updateTemplate = useUpdateTemplate()

	const [currentTemplateName, setCurrentTemplateName] = useState(template.name)

	const initialTagsAsResponses: TagResponse[] = template.tags.map(t => ({
		...t,
		usageCount: 0,
		type: 'template'
	}))

	const { items, value, onChange, onInput, onCreate, isLoading, searchValue } =
		useTagManagement({ initialTags: initialTagsAsResponses })

	const [initialTags, setInitialTags] = useState<TagResponse[]>(
		initialTagsAsResponses
	)
	const [isSaving, setIsSaving] = useState(false)

	const hasChanges = !isEqual(
		initialTags.map(t => t.id).sort(),
		(value || []).map(t => t.id).sort()
	)

	const handleSaveChanges = async () => {
		setIsSaving(true)
		try {
			await updateTemplate(template.id, {
				tagIds: (value || []).map(t => t.id)
			})
			setInitialTags(value || []) // Обновляем исходное состояние
			showCustomToast({
				title: 'Успешно',
				description: 'Теги успешно сохранены',
				type: 'success'
			})
		} catch (error) {
			showCustomToast({
				title: 'Ошибка',
				description: 'Произошла ошибка при сохранении тегов',
				type: 'error'
			})
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className='grid grid-cols-2 gap-6'>
			{/* Левая колонка: Превью */}
			<div className='col-span-1'>
				<Card
					verticalSpace='xs'
					horizontalSpace='xs'
					shadow={false}
					border
					className='h-[500px]'
				>
					{template.previewUrl ? (
						<div className='h-full w-full overflow-y-auto rounded-md bg-white'>
							<img
								src={`${template.previewUrl}?v=${Date.now()}`}
								alt={template.name}
								className='h-auto w-full'
							/>
						</div>
					) : (
						<div
							className='flex h-full w-full items-center justify-center rounded-md'
							style={{
								backgroundColor: 'var(--color-bg-secondary)'
							}}
						>
							<Text view='secondary' size='s'>
								Нет превью
							</Text>
						</div>
					)}
				</Card>
			</div>

			{/* Правая колонка: Информация и действия */}
			<div className='col-span-1 flex h-[500px] flex-col'>
				<div className='flex-grow space-y-4'>
					<div>
						{template.isSystem ? (
							<Text
								size='xl'
								weight='bold'
								as='h3'
								className='mb-2'
								view='primary'
							>
								{currentTemplateName}
							</Text>
						) : (
							<EditableTemplateName
								templateId={template.id}
								initialName={currentTemplateName}
								onNameUpdate={setCurrentTemplateName}
							/>
						)}
						<div className='mt-2 flex items-center gap-2 text-xs text-gray-500'>
							<Badge
								label={template.isSystem ? 'Системный' : 'Пользовательский'}
								status={template.isSystem ? 'system' : 'normal'}
								size='s'
							/>
							<Text size='xs' view='secondary'>
								•
							</Text>
							<Text size='xs' view='secondary'>
								Обновлен: {formatDate(template.updatedAt)}
							</Text>
						</div>
					</div>

					<div>
						<Text view='secondary' size='s' className='mb-2'>
							Теги
						</Text>
						{template.isSystem ? (
							<div className='flex flex-wrap gap-2'>
								{template.tags.length > 0 ? (
									template.tags.map(tag => (
										<Badge
											key={tag.id}
											label={tag.name}
											view='stroked'
											size='s'
										/>
									))
								) : (
									<Text size='s' view='secondary'>
										Тегов нет
									</Text>
								)}
							</div>
						) : (
							<div className='flex items-start gap-2'>
								<div className='max-h-[250px] flex-grow overflow-y-auto'>
									<TagSelector
										items={items}
										value={value}
										onChange={onChange}
										onInput={onInput}
										onCreate={onCreate}
										isLoading={isLoading}
										searchValue={searchValue}
									/>
								</div>
								<div className='w-10 flex-shrink-0'>
									{hasChanges && (
										<Button
											onlyIcon
											iconLeft={IconSave}
											size='m'
											iconSize='s'
											view='ghost'
											onClick={handleSaveChanges}
											loading={isSaving}
										/>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className='mt-auto grid grid-cols-2 gap-4 border-t border-gray-200 pt-4'>
					<Button view='ghost' label='Закрыть' onClick={onClose} width='full' />
					<Button
						label='Открыть в редакторе'
						onClick={() => {
							handleOpen(template)
							onClose()
						}}
						view='primary'
						width='full'
					/>
				</div>
			</div>
		</div>
	)
}
