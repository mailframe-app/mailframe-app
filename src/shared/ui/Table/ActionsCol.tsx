import type { IconComponent } from '@consta/icons/Icon'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconMeatball } from '@consta/icons/IconMeatball'
import { IconTrash } from '@consta/icons/IconTrash'
import { DataCell } from '@consta/table/DataCell'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { useRef, useState } from 'react'

import { buildHeader } from './buildHeader'

type ActionsColItem = {
	key: string
	label: string
	leftIcon?: IconComponent
	status?: 'alert' | 'warning' | 'success'
	onClick: () => void
}

export function ActionsCol<T extends { id: string }>({
	onEdit,
	onDelete
}: {
	onEdit?: (item: T) => void
	onDelete?: (item: T) => void
}) {
	return {
		width: 56,
		minWidth: 56,
		maxWidth: 56,
		pinned: 'right' as const,
		renderHeaderCell: buildHeader({
			label: ''
		}),
		renderCell: ({ row }: { row: T }) => {
			const [isMenuOpen, setIsMenuOpen] = useState(false)
			const buttonRef = useRef<HTMLElement>(null)

			const menuItems: ActionsColItem[] = []

			if (onEdit) {
				menuItems.push({
					key: 'edit',
					label: 'Редактировать',
					leftIcon: IconEdit,
					onClick: () => {
						onEdit(row)
						setIsMenuOpen(false)
					}
				})
			}

			if (onDelete) {
				menuItems.push({
					key: 'delete',
					label: 'Удалить',
					leftIcon: IconTrash,
					status: 'alert' as const,
					onClick: () => {
						onDelete(row)
						setIsMenuOpen(false)
					}
				})
			}

			return (
				<DataCell>
					<div className='flex justify-end'>
						<Button
							ref={buttonRef}
							view='clear'
							onlyIcon
							iconLeft={IconMeatball}
							iconSize='s'
							size='s'
							title='Действия'
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						/>
						{isMenuOpen && (
							<ContextMenu
								isOpen
								direction='downStartRight'
								anchorRef={buttonRef as any}
								offset='xs'
								className='!rounded-lg'
								style={{ zIndex: 1000 }}
								items={menuItems}
								getItemLabel={(item: ActionsColItem) => item.label}
								getItemKey={(item: ActionsColItem) => item.key}
								getItemOnClick={(item: ActionsColItem) => item.onClick}
								getItemLeftIcon={(item: ActionsColItem) => item.leftIcon}
								getItemStatus={(item: ActionsColItem) => item.status}
								onClickOutside={() => setIsMenuOpen(false)}
							/>
						)}
					</div>
				</DataCell>
			)
		}
	}
}
