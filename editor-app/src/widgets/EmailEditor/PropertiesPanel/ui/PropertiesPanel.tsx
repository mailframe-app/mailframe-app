import { IconClose } from '@consta/icons/IconClose'
import { IconCopy } from '@consta/icons/IconCopy'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { useEditor } from '@craftjs/core'
import React, { useState } from 'react'

import { copyNode } from '@/features/NodeActions'
import { useStorageModalProvider } from '@/features/Storage'
import { VariablesTab } from '@/features/VariablesTab'

import { cn, formatFileSize } from '@/shared/lib'

import { CanvasSettingsPanel } from '../../Canvas'
import { PROPERTIES_PANEL_TABS } from '../model/constants'
import type { PropertiesPanelTab } from '../model/types'

import { PropertiesPanelTabs } from './PropertiesPanetTabs'
import { useEditorTemplateStore } from '@/entities/EditorTemplate'

// Универсальная функция для получения имени компонента
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNodeDisplayName(node: any) {
	const type = node.data.type
	if (typeof type === 'function' && type.craft?.name) {
		return type.craft.name
	}
	if (typeof type === 'object' && type?.resolvedName) {
		return type.resolvedName
	}
	if (typeof type === 'string') {
		return type
	}
	return 'Компонент'
}

export const PropertiesPanel: React.FC = () => {
	const [activeTab, setActiveTab] = useState<PropertiesPanelTab>(PROPERTIES_PANEL_TABS[0])
	const updateVariableMapping = useEditorTemplateStore(s => s.updateVariableMapping)
	const { selectFile } = useStorageModalProvider()
	const { selected, actions, query } = useEditor(state => {
		const [currentNodeId] = state.events.selected || []
		let selected
		if (currentNodeId && state.nodes[currentNodeId]) {
			const node = state.nodes[currentNodeId]
			selected = {
				id: currentNodeId,
				name: getNodeDisplayName(node),
				isWide: node.data?.props?.isWide ?? false,
				settings: node.related?.settings
			}
		}
		return { selected }
	})

	// Проверка: если выбран именно корневой контейнер (canvas)
	const isCanvas =
		selected &&
		(selected.id === 'ROOT_CANVAS' || selected.id === 'ROOT' || selected.name === 'Container')

	// Передаем selectFile только в настройки для MjmlImage
	const propsToPass =
		selected?.name === 'Картинка' || selected?.name === 'Блок' || selected?.name === 'Сетки'
			? { startFileSelection: selectFile, formatFileSize }
			: selected?.name === 'Соцсети'
				? { startFileSelection: selectFile }
				: {}

	return (
		<div
			className={cn(
				'editor-properties flex h-full flex-col items-center border-gray-100 bg-white',
				selected?.isWide ? 'w-[720px]' : 'w-[320px]'
			)}
		>
			<PropertiesPanelTabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
				tabs={PROPERTIES_PANEL_TABS}
			/>
			{activeTab.value === 'properties' ? (
				<>
					{selected ? (
						<div className='w-full p-4'>
							<div className='mb-6 flex items-center justify-between'>
								<Text size='l' weight='medium'>
									{isCanvas ? 'Дизайн' : selected.name}
								</Text>
								{!isCanvas && (
									<div className='flex items-center space-x-2'>
										<Button
											view='ghost'
											size='xs'
											iconLeft={IconCopy}
											onClick={() => {
												copyNode(actions, query, selected.id)
											}}
											title='Копировать'
										/>

										<Button
											view='ghost'
											size='xs'
											iconLeft={IconTrash}
											onClick={() => {
												if (!selected) return
												actions.delete(selected.id)
												actions.selectNode('ROOT')
											}}
											title='Удалить'
										/>

										<Button
											view='ghost'
											size='xs'
											iconLeft={IconClose}
											onClick={() => actions.selectNode('ROOT')}
											title='Закрыть'
										/>
									</div>
								)}
							</div>
							<div className='space-y-4'>
								{isCanvas ? (
									<CanvasSettingsPanel startFileSelection={selectFile} />
								) : (
									selected.settings && React.createElement(selected.settings, propsToPass)
								)}
							</div>
						</div>
					) : (
						<div className='p-4'>
							<div className='py-16 text-center'>
								<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
									{/* ... */}
								</div>
								<Text size='m' weight='medium' className='mb-2 block'>
									Выберите элемент
								</Text>
								<Text size='s' view='secondary'>
									Кликните на элемент в области редактирования, чтобы настроить его свойства
								</Text>
							</div>
						</div>
					)}
				</>
			) : activeTab.value === 'variables' ? (
				<div className='flex w-full flex-1 overflow-y-auto'>
					<VariablesTab onMappingChange={updateVariableMapping} isWide={selected?.isWide} />
				</div>
			) : (
				<div className='flex h-full flex-col items-center justify-center text-gray-400'>
					<Text size='s'>Неизвестная вкладка</Text>
				</div>
			)}
		</div>
	)
}
