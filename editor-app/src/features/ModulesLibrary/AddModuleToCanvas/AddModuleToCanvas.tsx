import type { SerializedNode, SerializedNodes } from '@craftjs/core'
import { useEditor } from '@craftjs/core'
import React, { useEffect, useRef } from 'react'

import { replaceAllIdsExceptRoot } from '@/shared/lib'

import { useReusableBlocksStore } from '@/entities/ReusableBlocks'

type WithProps = { props?: Record<string, unknown> }
type WithResolvedName = { resolvedName?: string }

function hasModuleIdProp(node: SerializedNode): node is SerializedNode & WithProps {
	return typeof (node as WithProps).props === 'object' && (node as WithProps).props !== null
}

function getResolvedName(n?: SerializedNode): string | undefined {
	const t = n?.type as unknown as WithResolvedName | undefined
	return t?.resolvedName
}

const isSectionNode = (n?: SerializedNode) =>
	!!n && (n.displayName === 'Сетки' || getResolvedName(n) === 'MjmlSection')

const isBlockNode = (n?: SerializedNode) =>
	!!n && (n.displayName === 'Блок' || getResolvedName(n) === 'MjmlBlock')

export const AddModuleToCanvas: React.FC = () => {
	const processedRef = useRef<Set<string>>(new Set())

	const { actions, query, nodes } = useEditor(state => ({ nodes: state.nodes }))
	const { fetchBlockContent } = useReusableBlocksStore()

	useEffect(() => {
		const serialized: SerializedNodes = query.getSerializedNodes()

		const getModuleIdFromNode = (node: SerializedNode): string | null => {
			if (!hasModuleIdProp(node)) return null
			const raw = node.props
			if (!raw) return null
			const val = raw['__moduleId']
			return typeof val === 'string' ? val : null
		}

		const collectSubtree = (rootIds: string[], all: SerializedNodes): SerializedNodes => {
			const out: SerializedNodes = {}
			const visit = (id: string) => {
				const node = all[id]
				if (!node || out[id]) return
				out[id] = node
				if (Array.isArray(node.nodes)) node.nodes.forEach(visit)
				if (node.linkedNodes) Object.values(node.linkedNodes).forEach(visit)
			}
			rootIds.forEach(visit)
			return out
		}

		const extractElementRoots = (rootIds: string[], all: SerializedNodes): string[] => {
			const result: string[] = []

			const visit = (id: string, isRootLevel: boolean) => {
				const node = all[id]
				if (!node) return

				// Если это корневой элемент модуля (секция или блок), сохраняем его структуру
				if (isRootLevel && (isSectionNode(node) || isBlockNode(node))) {
					result.push(id)
					return
				}

				// Если это секция/блок внутри другого контейнера, пропускаем и обрабатываем дочерние элементы
				if (isSectionNode(node)) {
					const blocks = Array.isArray(node.nodes) ? node.nodes : []
					blocks.forEach(blockId => visit(blockId, false))
					return
				}
				if (isBlockNode(node)) {
					const elements = Array.isArray(node.nodes) ? node.nodes : []
					elements.forEach(elementId => visit(elementId, false))
					return
				}
				result.push(id)
			}

			rootIds.forEach(id => visit(id, true))
			return result
		}

		Object.entries(serialized).forEach(([nodeId, node]) => {
			const moduleId = getModuleIdFromNode(node as SerializedNode)
			if (!moduleId) return
			if (processedRef.current.has(nodeId)) return

			processedRef.current.add(nodeId)
				; (async () => {
					try {
						const content = await fetchBlockContent(moduleId)
						if (!content || !content.content) {
							actions.delete(nodeId)
							return
						}

						const rawNodes: SerializedNodes =
							typeof content.content === 'string'
								? (JSON.parse(content.content) as SerializedNodes)
								: (content.content as SerializedNodes)

						const nodesWithNewIds: SerializedNodes = replaceAllIdsExceptRoot(rawNodes)
						const savedRoot = nodesWithNewIds.ROOT
						if (!savedRoot || !Array.isArray(savedRoot.nodes) || savedRoot.nodes.length === 0) {
							actions.delete(nodeId)
							return
						}

						const currentState = query.getSerializedNodes() as SerializedNodes
						const placeholderNode = currentState[nodeId]
						const parentId = placeholderNode?.parent
						if (!parentId) {
							actions.delete(nodeId)
							return
						}
						const parent = currentState[parentId]
						const parentNodes = Array.isArray(parent?.nodes) ? [...parent.nodes] : []
						const idxInParent = parentNodes.indexOf(nodeId)

						let nodesToAdd: SerializedNodes = {}
						Object.entries(nodesWithNewIds).forEach(([id, n]) => {
							if (id !== 'ROOT') nodesToAdd[id] = { ...n }
						})

						const moduleRootChildren = [...savedRoot.nodes]
						const parentIsSection = isSectionNode(parent)
						const parentIsBlock = isBlockNode(parent)

						const elementRootIds = extractElementRoots(moduleRootChildren, nodesToAdd)
						if (elementRootIds.length === 0) {
							actions.delete(nodeId)
							return
						}

						nodesToAdd = collectSubtree(elementRootIds, nodesToAdd)

						// Проверяем, является ли корневой элемент секцией
						const rootElementIsSection = elementRootIds.some(id => isSectionNode(nodesToAdd[id]))

						let finalParentNodes = parentNodes

						if (parentIsBlock) {
							elementRootIds.forEach(id => {
								if (nodesToAdd[id]) nodesToAdd[id] = { ...nodesToAdd[id], parent: parentId }
							})

							finalParentNodes =
								idxInParent === -1
									? [...parentNodes, ...elementRootIds]
									: [
										...parentNodes.slice(0, idxInParent),
										...elementRootIds,
										...parentNodes.slice(idxInParent + 1)
									]

							const finalNodes: SerializedNodes = {
								...currentState,
								...nodesToAdd,
								[parentId]: { ...parent, nodes: finalParentNodes }
							}
							delete finalNodes[nodeId]
							actions.deserialize(finalNodes)
							return
						}

						if (parentIsSection) {
							// Если модуль начинается с секции и вставляется в секцию,
							// это означает, что нужно извлечь содержимое секции (блоки) и вставить их
							if (rootElementIsSection) {
								// Если модуль начинается с секции, извлекаем её дочерние элементы (блоки)
								const sectionId = elementRootIds.find(id => isSectionNode(nodesToAdd[id]))
								if (sectionId && nodesToAdd[sectionId]) {
									const sectionNodes = Array.isArray(nodesToAdd[sectionId].nodes) ? nodesToAdd[sectionId].nodes : []
									const genUniqueId = (
										prefix: string,
										snapshot: SerializedNodes,
										extra: SerializedNodes
									): string => {
										let id = ''
										do {
											id = `${prefix}_${Math.random().toString(36).slice(2, 10)}`
										} while (snapshot[id] || extra[id])
										return id
									}
									const newBlockId = genUniqueId('blk', currentState, nodesToAdd)

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
											bgImageUrl: null,
											bgSize: 'cover',
											bgRepeat: 'no-repeat',
											bgPosition: 'center',
											style: {}
										},
										displayName: 'Блок',
										custom: {},
										parent: parentId,
										hidden: false,
										nodes: [...sectionNodes],
										linkedNodes: {}
									}

									sectionNodes.forEach(id => {
										if (nodesToAdd[id]) nodesToAdd[id] = { ...nodesToAdd[id], parent: newBlockId }
									})
									nodesToAdd[newBlockId] = blockNode

									finalParentNodes =
										idxInParent === -1
											? [...parentNodes, newBlockId]
											: [
												...parentNodes.slice(0, idxInParent),
												newBlockId,
												...parentNodes.slice(idxInParent + 1)
											]

									const finalNodes: SerializedNodes = {
										...currentState,
										...nodesToAdd,
										[parentId]: { ...parent, nodes: finalParentNodes }
									}
									delete finalNodes[nodeId]
									actions.deserialize(finalNodes)
									return
								}
							}

							// Обычная логика для вставки в секцию
							const genUniqueId = (
								prefix: string,
								snapshot: SerializedNodes,
								extra: SerializedNodes
							): string => {
								let id = ''
								do {
									id = `${prefix}_${Math.random().toString(36).slice(2, 10)}`
								} while (snapshot[id] || extra[id])
								return id
							}
							const newBlockId = genUniqueId('blk', currentState, nodesToAdd)

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
									bgImageUrl: null,
									bgSize: 'cover',
									bgRepeat: 'no-repeat',
									bgPosition: 'center',
									style: {}
								},
								displayName: 'Блок',
								custom: {},
								parent: parentId,
								hidden: false,
								nodes: [...elementRootIds],
								linkedNodes: {}
							}

							elementRootIds.forEach(id => {
								if (nodesToAdd[id]) nodesToAdd[id] = { ...nodesToAdd[id], parent: newBlockId }
							})
							nodesToAdd[newBlockId] = blockNode

							finalParentNodes =
								idxInParent === -1
									? [...parentNodes, newBlockId]
									: [
										...parentNodes.slice(0, idxInParent),
										newBlockId,
										...parentNodes.slice(idxInParent + 1)
									]

							const finalNodes: SerializedNodes = {
								...currentState,
								...nodesToAdd,
								[parentId]: { ...parent, nodes: finalParentNodes }
							}
							delete finalNodes[nodeId]
							actions.deserialize(finalNodes)
							return
						}

						// Вставка в Container или другой родитель - вставляем элементы напрямую
						elementRootIds.forEach(id => {
							if (nodesToAdd[id]) nodesToAdd[id] = { ...nodesToAdd[id], parent: parentId }
						})

						finalParentNodes =
							idxInParent === -1
								? [...parentNodes, ...elementRootIds]
								: [
									...parentNodes.slice(0, idxInParent),
									...elementRootIds,
									...parentNodes.slice(idxInParent + 1)
								]

						const finalNodes: SerializedNodes = {
							...currentState,
							...nodesToAdd,
							[parentId]: { ...parent, nodes: finalParentNodes }
						}
						delete finalNodes[nodeId]
						actions.deserialize(finalNodes)
					} catch {
						try {
							actions.delete(nodeId)
						} catch {
							// ignore
						}
					}
				})()
		})
	}, [actions, query, fetchBlockContent, nodes])

	return null
}
