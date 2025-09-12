import type { Node, NodeId, SerializedNode } from '@craftjs/core'

export type CopyNodeActions = {
	add: (node: Node, parentId: NodeId, index?: number) => void
	deserialize: (nodes: Record<string, SerializedNode>) => void
}

export type CopyNodeQuery = {
	getSerializedNodes: () => Record<string, SerializedNode>
}
