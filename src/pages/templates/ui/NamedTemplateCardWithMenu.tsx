import React, { useRef, useState } from 'react'

import { useTemplateActions } from '../model/use-template-actions'

import { NamedTemplateCard, type TemplateListItem } from '@/entities/templates'
import { ContextMenu as WidgetContextMenu } from '@/widgets/contextMenu'

interface NamedTemplateCardWithMenuProps {
	template: TemplateListItem
	tabId: 'library' | 'my-templates'
}

export function NamedTemplateCardWithMenu({
	template,
	tabId
}: NamedTemplateCardWithMenuProps) {
	const [menuState, setMenuState] = useState<{
		isOpen: boolean
		x: number
		y: number
	}>({ isOpen: false, x: 0, y: 0 })
	const anchorRef = useRef<HTMLDivElement>(null)
	const menuItems = useTemplateActions(template, tabId)

	const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		setMenuState({
			isOpen: true,
			x: e.clientX,
			y: e.clientY
		})
	}

	const handleCloseMenu = () => {
		setMenuState({ isOpen: false, x: 0, y: 0 })
	}

	return (
		<>
			<div onClick={handleCardClick} className='cursor-pointer'>
				<NamedTemplateCard template={template} />
			</div>
			{menuState.isOpen && (
				<>
					<div
						ref={anchorRef}
						style={{
							position: 'fixed',
							left: menuState.x,
							top: menuState.y,
							width: 1,
							height: 1,
							pointerEvents: 'none'
						}}
					/>
					<WidgetContextMenu
						items={menuItems}
						anchorRef={anchorRef as any}
						isOpen={menuState.isOpen}
						onClickOutside={handleCloseMenu}
						row={template}
					/>
				</>
			)}
		</>
	)
}
