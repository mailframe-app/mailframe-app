import { IconArrowRedone } from '@consta/icons/IconArrowRedone'
import { IconArrowUndone } from '@consta/icons/IconArrowUndone'
import { IconEye } from '@consta/icons/IconEye'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { useEditor } from '@craftjs/core'

import type { EditorActions, EditorToolsProps } from '../model/types'

export const EditorTools: React.FC<EditorToolsProps> = ({ onPreviewClick }) => {
	// Получаем экшены и состояние истории из хука useEditor
	const editor = useEditor()
	const canUndo = editor.query.history.canUndo()
	const canRedo = editor.query.history.canRedo()
	const actions = editor.actions as EditorActions

	return (
		<Card
			verticalSpace='xs'
			horizontalSpace='xs'
			className='absolute bottom-[59px] left-[59px] z-10 flex items-center justify-between gap-2 !rounded-lg'
			style={{
				backgroundColor: 'var(--color-bg-default)'
			}}
		>
			<Button
				view='clear'
				iconLeft={IconArrowUndone}
				size='s'
				title='Отменить'
				disabled={!canUndo}
				onClick={() => actions.history.undo()}
			/>
			<Button
				view='clear'
				iconLeft={IconArrowRedone}
				size='s'
				title='Вернуть'
				disabled={!canRedo}
				onClick={() => actions.history.redo()}
			/>
			<Button
				view='clear'
				iconLeft={IconEye}
				size='s'
				title='Предпросмотр'
				onClick={onPreviewClick}
			/>
		</Card>
	)
}
