export const WrapType = {
	SECTION_ONLY: 'section',
	SECTION_BLOCK: 'section_block'
} as const

export interface WrapperStructure {
	wrapType: keyof typeof WrapType
	sectionId: string
	blockId?: string
	originalNodeId: string
	parentId: string
	insertIndex: number
}

export const shouldWrapNode = (
	nodeName: string,
	parentName: string
): keyof typeof WrapType | null => {
	// Единственный auto-wrap: Блок на верхнем уровне заворачиваем в Сетку
	if (parentName === 'Container' && nodeName === 'Блок') {
		return 'SECTION_ONLY'
	}
	// Все остальные случаи — не оборачиваем (кидать можно только в Блок)
	return null
}

export const generateNodeId = (): string => {
	const timestamp = Date.now().toString(36)
	const random = Math.random().toString(36).substring(2, 8)
	return `${timestamp}-${random}`
}

export const createWrapperStructure = (
	nodeId: string,
	wrapType: keyof typeof WrapType,
	parentId: string,
	insertIndex: number
): WrapperStructure => {
	const sectionId = generateNodeId()
	const blockId = wrapType === 'SECTION_BLOCK' ? generateNodeId() : undefined

	return {
		wrapType,
		sectionId,
		blockId,
		originalNodeId: nodeId,
		parentId,
		insertIndex
	}
}
