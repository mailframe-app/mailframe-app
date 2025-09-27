import { IconSelect } from '@consta/icons/IconSelect'
import { IconSelectOpen } from '@consta/icons/IconSelectOpen'
import { Button } from '@consta/uikit/Button'
import { Popover } from '@consta/uikit/Popover'
import { Text } from '@consta/uikit/Text'
import React from 'react'

import { useTemplateActionsMenu } from '@/features/TemplateActions'
import { ThemeToggle } from '@/features/theme'

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
			{isMenuOpen && (
				<Popover
					direction='downStartRight'
					offset='xs'
					onClickOutside={closeMenu}
					anchorRef={menuAnchorRef as React.RefObject<HTMLElement>}
					className='min-w-[280px] rounded-lg p-2'
					style={{
						zIndex: 1000,
						backgroundColor: 'var(--color-bg-default)',
						boxShadow: '0 0 0 1px var(--color-bg-ghost)'
					}}
				>
					<div>
						<div className='flex justify-center py-2'>
							<ThemeToggle />
						</div>
						<div className='my-1 h-[1px]' style={{ backgroundColor: 'var(--color-bg-ghost)' }} />
						<div>
							{items.map(item => (
								<button
									key={item.id}
									type='button'
									className='flex w-full items-center gap-x-2 rounded px-2 py-2 text-[var(--color-typo-primary)] hover:bg-[var(--color-control-bg-clear-hover)]'
									onClick={() => handleItemClick(item)}
									style={{
										color:
											'id' in item && item.id === 'delete' ? 'var(--color-typo-alert)' : undefined
									}}
								>
									{item.leftIcon && <item.leftIcon size='s' />}
									<Text
										view={'id' in item && item.id === 'delete' ? 'alert' : 'primary'}
										size='m'
										as='span'
									>
										{item.label}
									</Text>
								</button>
							))}
						</div>
					</div>
				</Popover>
			)}

			<LazyModals />
		</>
	)
}
