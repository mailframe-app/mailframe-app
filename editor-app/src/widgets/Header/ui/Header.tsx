import { IconBackward } from '@consta/icons/IconBackward'
import { Button } from '@consta/uikit/Button'

import { EditableTitle } from '@/features/TemplateActions'

import { ActionsMenu } from './TemplateActions'
import { AutosaveIndicator } from '@/entities/EditorTemplate'

export const Header = () => {
	return (
		<header className='flex w-full items-center justify-between bg-[var(--color-bg-default)] px-8 py-5'>
			{/* Левая часть */}
			<div className='flex min-w-0 items-center gap-13'>
				<Button
					view='clear'
					iconLeft={IconBackward}
					size='m'
					iconSize='s'
					className='cursor-pointer !border !border-[var(--color-bg-ghost)]'
					onClick={() => (window.location.href = '/templates')}
				/>
				<EditableTitle />
			</div>

			{/* Правая часть */}
			<div className='flex items-center gap-6'>
				<AutosaveIndicator />
				<ActionsMenu />
			</div>
		</header>
	)
}
