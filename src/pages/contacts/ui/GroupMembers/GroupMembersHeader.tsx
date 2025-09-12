import { IconBackward } from '@consta/icons/IconBackward'
import { IconKebab } from '@consta/icons/IconKebab'
import { Button } from '@consta/uikit/Button'
import { ContextMenu } from '@consta/uikit/ContextMenu'
import { Text } from '@consta/uikit/Text'
import React from 'react'

export type SettingsItem = {
	key: string
	label: string
	onClick: () => void
	leftIcon?: React.ComponentType<any>
	status?: string
}

type Props = {
	title: string
	description?: string
	updatedAt?: string
	onBack: () => void
	settingsItems: SettingsItem[]
	rightContent?: React.ReactNode
}

export default function GroupMembersHeader({
	title,
	description,
	updatedAt,
	onBack,
	settingsItems,
	rightContent
}: Props) {
	const settingsRef = React.useRef<HTMLButtonElement | null>(null)
	const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)

	return (
		<div className='mb-2 flex items-start justify-between'>
			<div className='flex items-start gap-4'>
				<Button
					view='ghost'
					onlyIcon
					iconLeft={IconBackward}
					size='m'
					aria-label='Назад'
					onClick={onBack}
				/>
				<div className='flex flex-col'>
					<Text size='3xl' view='primary' weight='bold' className='mb-2'>
						{title}
					</Text>
					{(description || updatedAt) && (
						<div className='mt-1'>
							{description && (
								<Text size='s' view='secondary'>
									{description}
								</Text>
							)}
							{updatedAt && (
								<Text size='xs' view='secondary' className='block'>
									Обновлено: {updatedAt}
								</Text>
							)}
						</div>
					)}
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<Button
					ref={settingsRef as any}
					view='clear'
					onlyIcon
					iconLeft={IconKebab}
					size='m'
					aria-label='Настройки группы'
					onClick={() => setIsSettingsOpen(v => !v)}
				/>
				{isSettingsOpen ? (
					<ContextMenu
						isOpen
						direction='downStartRight'
						anchorRef={settingsRef as any}
						offset='xs'
						items={settingsItems as any}
						getItemLabel={(i: any) => i.label}
						getItemKey={(i: any) => i.key}
						getItemOnClick={(i: any) => i.onClick}
						onClickOutside={() => setIsSettingsOpen(false)}
					/>
				) : null}
				{rightContent}
			</div>
		</div>
	)
}
