export interface EditorActions {
	history: {
		undo: () => void
		redo: () => void
	}
}

export interface EditorToolsProps {
	onPreviewClick: () => void
}
