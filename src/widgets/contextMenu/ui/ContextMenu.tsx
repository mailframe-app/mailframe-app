import { ContextMenu as ConstaContextMenu } from '@consta/uikit/ContextMenu'
import React, { useEffect } from 'react'

import type { ContextMenuGroup, ContextMenuItem } from '../model/types'

export interface WidgetContextMenuProps<Row = unknown> {
	items: ContextMenuItem<Row>[]
	groups?: ContextMenuGroup[]
	anchorRef: React.RefObject<HTMLElement>
	isOpen: boolean
	onClickOutside: () => void
	row: Row | null
	sortGroup?: (a: string | number, b: string | number) => number
}

export function ContextMenu<Row = unknown>(props: WidgetContextMenuProps<Row>) {
	const { items, groups, anchorRef, isOpen, onClickOutside, row, sortGroup } =
		props

	useEffect(() => {
		if (!isOpen) return
		const handleScroll = () => onClickOutside()
		const handleResize = () => onClickOutside()
		const handleWheel = () => onClickOutside()
		const handleTouchMove = () => onClickOutside()

		window.addEventListener('scroll', handleScroll, { passive: true })
		window.addEventListener('resize', handleResize)
		window.addEventListener('wheel', handleWheel, { passive: true })
		window.addEventListener('touchmove', handleTouchMove, { passive: true })

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('wheel', handleWheel)
			window.removeEventListener('touchmove', handleTouchMove)
		}
	}, [isOpen, onClickOutside])

	return (
		<ConstaContextMenu
			items={items as any}
			groups={groups as any}
			isOpen={isOpen}
			form='brick'
			className='cm-no-focus m-16 !rounded-lg'
			onClickOutside={onClickOutside as any}
			onEsc={onClickOutside}
			anchorRef={anchorRef as any}
			style={{ zIndex: 1000, padding: '16px 2px' }}
			getItemLabel={(i: ContextMenuItem) => i.label}
			getItemKey={(i: ContextMenuItem) => i.key}
			getItemLeftIcon={(i: ContextMenuItem) => i.leftIcon as any}
			getItemRightIcon={(i: ContextMenuItem) => i.rightIcon as any}
			getItemStatus={(i: ContextMenuItem) => i.status as any}
			getItemDisabled={(i: ContextMenuItem) => !!i.disabled}
			getItemGroupId={(i: ContextMenuItem) => i.groupId as any}
			getGroupId={(g: ContextMenuGroup) => g.id as any}
			getGroupLabel={(g: ContextMenuGroup) => g.label}
			sortGroup={sortGroup as any}
			onItemClick={(params: any) => {
				const item = params?.item as ContextMenuItem<Row> | undefined
				if (item) item.onClick?.(row as Row)
				onClickOutside()
			}}
		/>
	)
}

export default ContextMenu
