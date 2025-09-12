import type { SerializedNode, SerializedNodes } from '@craftjs/core'
import { useEditor } from '@craftjs/core'
import { useEffect, useRef } from 'react'

import { WrapType, createWrapperStructure, shouldWrapNode } from './wrapperRules'

export const useAutoWrapper = () => {
	const { actions, query } = useEditor()
	const processedNodesRef = useRef<Set<string>>(new Set())

	// Подписываемся на изменения узлов
	const { nodes } = useEditor(state => ({ nodes: state.nodes }))

	useEffect(() => {
		const currentNodes: SerializedNodes = query.getSerializedNodes()
		const nodesToWrap: Array<{
			nodeId: string
			wrapType: keyof typeof WrapType
			parentId: string
			insertIndex: number
		}> = []

		// Ищем узлы, которые нужно обернуть
		Object.entries(currentNodes).forEach(([nodeId, node]) => {
			// Пропускаем уже обработанные узлы
			if (processedNodesRef.current.has(nodeId)) return

			// Безопасная проверка структуры узла
			if (!node || !node.parent || !node.displayName) return

			const parentNode = currentNodes[node.parent]
			if (!parentNode || !parentNode.displayName) return

			// Определяем, нужно ли оборачивание
			const wrapType = shouldWrapNode(node.displayName, parentNode.displayName)
			if (!wrapType) return

			// Безопасная проверка наличия nodes у родителя
			if (!parentNode.nodes || !Array.isArray(parentNode.nodes)) return

			// Находим позицию узла в родителе
			const insertIndex = parentNode.nodes.indexOf(nodeId)
			if (insertIndex === -1) return

			console.log(
				`%c🔍 НАЙДЕН УЗЕЛ ДЛЯ ОБОРАЧИВАНИЯ: ${node.displayName} -> ${wrapType}`,
				'color: orange;'
			)

			nodesToWrap.push({
				nodeId,
				wrapType,
				parentId: node.parent,
				insertIndex
			})
		})

		// Если есть узлы для оборачивания - применяем изменения
		if (nodesToWrap.length > 0) {
			console.log(`%c🔄 ОБОРАЧИВАЕМ ${nodesToWrap.length} УЗЛОВ`, 'font-weight: bold; color: red;')

			let updatedNodes = { ...currentNodes }

			nodesToWrap.forEach(({ nodeId, wrapType, parentId, insertIndex }) => {
				const wrapperStructure = createWrapperStructure(nodeId, wrapType, parentId, insertIndex)

				// Помечаем узел как обработанный
				processedNodesRef.current.add(nodeId)
				processedNodesRef.current.add(wrapperStructure.sectionId)
				if (wrapperStructure.blockId) {
					processedNodesRef.current.add(wrapperStructure.blockId)
				}

				// Создаем узел секции
				const sectionNode: SerializedNode = {
					type: { resolvedName: 'MjmlSection' },
					isCanvas: true,
					props: {
						gap: 20,
						paddingTop: '20px',
						paddingRight: '0px',
						paddingBottom: '20px',
						paddingLeft: '0px',
						containersBackground: 'transparent',
						borderRadius: '0px',
						hasBgImage: false,
						bgSize: 'cover',
						bgRepeat: 'no-repeat',
						bgPosition: 'center'
					},
					displayName: 'Сетки',
					custom: {},
					parent: parentId,
					hidden: false,
					nodes: wrapperStructure.blockId ? [wrapperStructure.blockId] : [nodeId],
					linkedNodes: {}
				}

				// Добавляем секцию
				updatedNodes[wrapperStructure.sectionId] = sectionNode

				if (wrapperStructure.wrapType === 'SECTION_BLOCK' && wrapperStructure.blockId) {
					// Создаем узел блока
					const blockNode: SerializedNode = {
						type: { resolvedName: 'MjmlBlock' },
						isCanvas: true,
						props: {
							background: 'transparent',
							widthPercent: 100,
							height: 'auto',
							align: 'left',
							paddingTop: '0px',
							paddingRight: '0px',
							paddingBottom: '0px',
							paddingLeft: '0px',
							borderRadius: '0px',
							hasBgImage: false,
							bgSize: 'cover',
							bgRepeat: 'no-repeat',
							bgPosition: 'center',
							style: {}
						},
						displayName: 'Блок',
						custom: {},
						parent: wrapperStructure.sectionId,
						hidden: false,
						nodes: [nodeId],
						linkedNodes: {}
					}

					// Добавляем блок
					updatedNodes[wrapperStructure.blockId] = blockNode

					// Обновляем родителя исходного узла на блок
					updatedNodes[nodeId] = {
						...updatedNodes[nodeId],
						parent: wrapperStructure.blockId
					}
				} else {
					// Обновляем родителя исходного узла на секцию
					updatedNodes[nodeId] = {
						...updatedNodes[nodeId],
						parent: wrapperStructure.sectionId
					}
				}

				// Обновляем родительский узел - заменяем исходный узел на секцию
				const parent = updatedNodes[parentId]
				const newParentNodes = [...parent.nodes]
				newParentNodes[insertIndex] = wrapperStructure.sectionId

				updatedNodes[parentId] = {
					...parent,
					nodes: newParentNodes
				}

				console.log(
					`%c✅ ОБЕРНУЛИ: ${updatedNodes[nodeId].displayName} в ${wrapperStructure.wrapType}`,
					'color: green;'
				)
			})

			// Применяем все изменения
			actions.deserialize(updatedNodes)
		}
	}, [nodes, actions, query])
}
