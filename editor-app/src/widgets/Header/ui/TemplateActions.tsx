import { IconSelect } from '@consta/icons/IconSelect'
import { IconSelectOpen } from '@consta/icons/IconSelectOpen'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import React from 'react'

import { useTemplateActionsMenu } from '@/features/TemplateActions'

export const ActionsMenu = () => {
	const { isMenuOpen, toggleMenu, closeMenu, menuAnchorRef, items, handleItemClick, LazyModals } =
		useTemplateActionsMenu()

	return (
		<>
			<Button
				ref={menuAnchorRef}
				onClick={toggleMenu}
				label='Меню шаблона'
				iconRight={isMenuOpen ? IconSelectOpen : IconSelect}
				view='primary'
				aria-haspopup='menu'
				aria-expanded={isMenuOpen}
			/>
			<ContextMenu
				isOpen={isMenuOpen}
				items={items}
				getItemLabel={item => item.label}
				getItemLeftIcon={item => item.leftIcon}
				onItemClick={handleItemClick}
				anchorRef={menuAnchorRef as React.RefObject<HTMLElement>}
				onClickOutside={closeMenu}
				direction='downStartRight'
				offset='xs'
				role='menu'
				className='!min-w-[280px] !rounded-lg'
				style={{ zIndex: 1000, padding: '16px 2px' }}
			/>

			<LazyModals />
		</>
	)
}
