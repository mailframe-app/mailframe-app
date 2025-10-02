import type { IconComponent } from '@consta/icons/Icon'
import { Button } from '@consta/uikit/Button'

export function RightControlButtons({
	sortView,
	sortIcon,
	onSortClick
}: {
	sortView: 'clear' | 'ghost'
	sortIcon: IconComponent
	onSortClick: () => void
}) {
	return (
		<>
			<Button
				key='sort'
				view={sortView}
				size='s'
				onlyIcon
				iconLeft={sortIcon}
				style={{
					color: 'var(--color-bg-primary)!important'
				}}
				onClick={onSortClick}
			/>
			{/* <Button
				key='filter'
				view='clear'
				size='s'
				onlyIcon
				iconLeft={IconFunnel}
				disabled
				style={{
					color: 'var(--color-bg-link)!important'
				}}
			/> */}
		</>
	)
}
