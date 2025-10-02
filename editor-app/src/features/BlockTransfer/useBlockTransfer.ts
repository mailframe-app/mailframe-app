// features/BlockTransfer/useBlockTransfer.ts
import type { SerializedNode, SerializedNodes } from '@craftjs/core'
import { useEditor } from '@craftjs/core'
import { nanoid } from 'nanoid'

type ClipPayload = {
	map: SerializedNodes
	rootIds: string[]
}

const clipboardRef: { payload?: ClipPayload; sourceBlockId?: string } = {}

function deepCollectSubtree(
	all: SerializedNodes,
	roots: string[]
): { map: SerializedNodes; rootIds: string[] } {
	const map: SerializedNodes = {}
	const push = (id: string) => {
		const node = all[id]
		if (!node || map[id]) return
		map[id] = node
		if (Array.isArray(node.nodes)) node.nodes.forEach(push)
		if (node.linkedNodes) Object.values(node.linkedNodes).forEach(push)
	}
	roots.forEach(push)
	return { map, rootIds: roots }
}

function remapIds(payload: ClipPayload): {
	map: SerializedNodes
	rootIds: string[]
	idMap: Record<string, string>
} {
	const idMap: Record<string, string> = {}
	Object.keys(payload.map).forEach(oldId => {
		idMap[oldId] = nanoid(8)
	})

	const map: SerializedNodes = {}
	for (const [oldId, node] of Object.entries(payload.map)) {
		const newId = idMap[oldId]
		const cloned: SerializedNode = {
			...node,
			parent: node.parent ? (idMap[node.parent] ?? node.parent) : node.parent,
			nodes: Array.isArray(node.nodes) ? node.nodes.map(id => idMap[id] ?? id) : node.nodes,
			linkedNodes: node.linkedNodes
				? Object.fromEntries(Object.entries(node.linkedNodes).map(([k, v]) => [k, idMap[v] ?? v]))
				: {}
		}
		map[newId] = cloned
	}

	const rootIds = payload.rootIds.map(id => idMap[id] ?? id)
	return { map, rootIds, idMap }
}

export function useBlockTransfer() {
	const { query, actions } = useEditor()

	const getAll = () => query.getSerializedNodes()

	// Без обращения к type.resolvedName — только displayName
	const isBlock = (id: string, all = getAll()) => {
		const n = all[id] as SerializedNode & { displayName?: string }
		return n?.displayName === 'Блок'
	}

	const getBlockChildren = (blockId: string, all = getAll()): string[] => {
		const n = all[blockId]
		if (!n) return []
		return Array.isArray(n.nodes) ? [...n.nodes] : []
	}

	const clearBlockChildren = (blockId: string, updated: SerializedNodes) => {
		const block = updated[blockId]
		if (!block) return
		const removeRec = (id: string) => {
			const node = updated[id]
			if (!node) return
			if (Array.isArray(node.nodes)) node.nodes.forEach(removeRec)
			if (node.linkedNodes) Object.values(node.linkedNodes).forEach(removeRec)
			delete updated[id]
		}
		const oldChildren = Array.isArray(block.nodes) ? [...block.nodes] : []
		oldChildren.forEach(removeRec)
		updated[blockId] = { ...block, nodes: [] }
	}

	const copyFromBlock = (sourceBlockId: string) => {
		const all = getAll()
		if (!isBlock(sourceBlockId, all)) return false
		const roots = getBlockChildren(sourceBlockId, all)
		const payload = deepCollectSubtree(all, roots)
		clipboardRef.payload = payload
		clipboardRef.sourceBlockId = sourceBlockId
		return true
	}

	type PasteMode = 'append' | 'replace' | 'move' | 'swap'

	const pasteIntoBlock = (targetBlockId: string, mode: PasteMode = 'append') => {
		const payload = clipboardRef.payload
		if (!payload) return false

		const all = getAll()
		if (!isBlock(targetBlockId, all)) return false

		if (mode === 'swap') {
			const sourceBlockId = clipboardRef.sourceBlockId
			if (!sourceBlockId || sourceBlockId === targetBlockId) return false

			const targetRoots = getBlockChildren(targetBlockId, all)
			const targetPayload = deepCollectSubtree(all, targetRoots)

			if (!internalPaste(targetBlockId, payload, 'replace')) return false
			return internalPaste(sourceBlockId, targetPayload, 'replace')
		}

		const ok = internalPaste(targetBlockId, payload, mode)
		if (ok && mode === 'move' && clipboardRef.sourceBlockId) {
			const updated = { ...getAll() }
			clearBlockChildren(clipboardRef.sourceBlockId, updated)
			actions.deserialize(updated)
			clipboardRef.sourceBlockId = undefined
		}
		return ok
	}

	const internalPaste = (
		targetBlockId: string,
		payload: ClipPayload,
		mode: Exclude<PasteMode, 'swap'>
	) => {
		const current = { ...getAll() }
		const target = current[targetBlockId]
		if (!target) return false

		const { map, rootIds } = remapIds(payload)

		rootIds.forEach(rid => {
			const node = map[rid]
			map[rid] = { ...node, parent: targetBlockId }
		})

		if (mode === 'replace') {
			clearBlockChildren(targetBlockId, current)
		}

		Object.assign(current, map)

		const prev = Array.isArray(current[targetBlockId].nodes) ? current[targetBlockId].nodes : []
		const nextNodes = mode === 'append' ? [...prev, ...rootIds] : [...rootIds]
		current[targetBlockId] = { ...current[targetBlockId], nodes: nextNodes }

		actions.deserialize(current)
		return true
	}

	return {
		copyFromBlock,
		pasteIntoBlock,
		hasClipboard: () => !!clipboardRef.payload,
		getClipboardInfo: () => ({
			hasPayload: !!clipboardRef.payload,
			hasSource: !!clipboardRef.sourceBlockId,
			sourceBlockId: clipboardRef.sourceBlockId,
			roots: clipboardRef.payload?.rootIds.length ?? 0
		})
	}
}
