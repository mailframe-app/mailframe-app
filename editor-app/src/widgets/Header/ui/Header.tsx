import { IconBackward } from '@consta/icons/IconBackward'
import { Button } from '@consta/uikit/Button'

import { EditableTitle } from '@/features/TemplateActions'

import { ActionsMenu } from './TemplateActions'
import { AutosaveIndicator } from '@/entities/EditorTemplate'

export const Header = () => {
	return (
		<header className='flex w-full items-center justify-between border-b border-gray-200 bg-white px-8 py-5 shadow-sm'>
			{/* Левая часть */}
			<div className='flex min-w-0 items-center gap-13'>
				<Button
					view='secondary'
					iconLeft={IconBackward}
					size='s'
					className='rounded-full border border-gray-200'
					style={{
						boxShadow: '0px 2px 8px 0px rgba(0,32,51,0.16)',
						border: '1px solid #E5E6EB',
						width: '40px',
						height: '40px'
					}}
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
