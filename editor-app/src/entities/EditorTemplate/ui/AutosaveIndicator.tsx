import { Text } from '@consta/uikit/Text'
import { Tooltip } from '@consta/uikit/Tooltip'
import { useState } from 'react'

import { useEditorTemplateStore } from '../model/editor.store'

export const AutosaveIndicator = () => {
	const { autosaveStatus, lastSaved, hasUnsavedChanges } = useEditorTemplateStore()
	const [isHovered, setIsHovered] = useState(false)
	const [position, setPosition] = useState<{ x: number; y: number } | undefined>(undefined)

	let statusText = ''
	let dotColor = ''
	let isPulsing = false

	switch (autosaveStatus) {
		case 'idle':
			statusText = 'Сохранено'
			dotColor = 'bg-green-500'
			isPulsing = false
			break
		case 'pending':
			statusText = 'Сохранение...'
			dotColor = 'bg-yellow-500'
			isPulsing = true
			break
		case 'success':
			statusText = `Сохранено`
			dotColor = 'bg-green-500'
			isPulsing = false
			break
		case 'error':
			statusText = 'Ошибка сохранения'
			dotColor = 'bg-red-500'
			isPulsing = false
			break
	}

	// Если есть несохраненные изменения, показываем желтую точку
	if (hasUnsavedChanges && autosaveStatus !== 'pending') {
		dotColor = 'bg-yellow-500'
		statusText = 'Есть несохраненные изменения'
	}

	const handleMouseMove = (event: React.MouseEvent) => {
		setPosition({ x: event.clientX, y: event.clientY })
	}

	return (
		<>
			<div
				className='relative cursor-pointer'
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => {
					setIsHovered(false)
					setPosition(undefined)
				}}
				onMouseMove={handleMouseMove}
			>
				<div className={`relative flex items-center`}>
					<span
						className={`${isPulsing ? 'animate-pulse' : ''} h-2 w-2 rounded-full ${dotColor}`}
					></span>
					{isPulsing && (
						<span className='absolute top-0 left-0 h-2 w-2 animate-ping rounded-full bg-yellow-500 opacity-75'></span>
					)}
				</div>
			</div>

			{isHovered && position && (
				<Tooltip
					isOpen={true}
					direction='upCenter'
					spareDirection='downStartLeft'
					position={position}
					isInteractive={false}
				>
					<div className='flex flex-col'>
						<Text view='secondary' size='xs'>
							{statusText}
						</Text>
						{lastSaved && (
							<Text view='secondary' size='xs'>
								Последнее сохранение: {new Date(lastSaved).toLocaleTimeString('ru-RU')}
							</Text>
						)}
					</div>
				</Tooltip>
			)}
		</>
	)
}
