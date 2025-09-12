import type { IconComponent } from '@consta/icons/Icon'
import { IconSelect } from '@consta/icons/IconSelect'
import { IconSelectOpen } from '@consta/icons/IconSelectOpen'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { TextField } from '@consta/uikit/TextField'
import React, { useMemo, useRef } from 'react'

type ItemStatus = 'alert' | 'warning' | 'success'

export type ActionsBarItem = {
	key: string
	label: string
	onClick: () => void
	leftIcon?: IconComponent
	status?: ItemStatus
}

export type ActionsBarProps = {
	placeholder: string
	search: string
	onSearchChange: (value: string) => void
	isActionsOpen: boolean
	onToggleActions: () => void
	onCloseActions: () => void
	actionsDisabled?: boolean
	items: ActionsBarItem[]
	className?: string
	rightExtras?: React.ReactNode
}

const ActionsBar: React.FC<ActionsBarProps> = ({
	placeholder,
	search,
	onSearchChange,
	isActionsOpen,
	onToggleActions,
	onCloseActions,
	actionsDisabled = false,
	items,
	className,
	rightExtras
}) => {
	const actionsButtonRef = useRef<any>(null)
	const menuItems = useMemo(() => items, [items])

	return (
		<div
			className={`my-8 flex items-center justify-between gap-3 ${className || ''}`}
		>
			<div className='w-[280px] md:w-[320px]'>
				<TextField
					placeholder={placeholder}
					value={search}
					onChange={value => onSearchChange((value as string) || '')}
					size='m'
					withClearButton
					className='w-full'
				/>
			</div>
			<div className='ml-auto flex items-center gap-2'>
				{rightExtras}
				<Button
					ref={actionsButtonRef as any}
					size='m'
					view='ghost'
					label='Действия'
					iconRight={isActionsOpen ? IconSelectOpen : IconSelect}
					className='w-[200px] justify-between'
					disabled={actionsDisabled}
					onClick={() => {
						if (!actionsDisabled) onToggleActions()
					}}
				/>
				{isActionsOpen && !actionsDisabled ? (
					<ContextMenu
						isOpen
						direction='downStartRight'
						anchorRef={actionsButtonRef as any}
						offset='xs'
						className='cm-no-focus !rounded-lg'
						style={{ zIndex: 1000, padding: '16px 2px' }}
						items={menuItems as any}
						getItemLabel={(i: ActionsBarItem) => i.label}
						getItemKey={(i: ActionsBarItem) => i.key}
						getItemOnClick={(i: ActionsBarItem) => i.onClick}
						getItemLeftIcon={(i: ActionsBarItem) => i.leftIcon}
						getItemStatus={(i: ActionsBarItem) => i.status}
						onClickOutside={() => {
							if (isActionsOpen) onCloseActions()
						}}
					/>
				) : null}
			</div>
		</div>
	)
}

export default ActionsBar
