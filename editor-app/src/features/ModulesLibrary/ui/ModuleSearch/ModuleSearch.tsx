import { IconFunnel } from '@consta/icons/IconFunnel'
import { Button } from '@consta/uikit/Button'
import React, { useRef } from 'react'

import { FilterPopover } from './FilterPopover'
import { SearchInput } from './SearchInput'

export const ModuleSearch: React.FC = () => {
	const [isPopoverVisible, setIsPopoverVisible] = React.useState(false)
	const anchorRef = useRef<HTMLButtonElement>(null)

	const togglePopover = () => {
		setIsPopoverVisible(!isPopoverVisible)
	}

	const closePopover = () => {
		setIsPopoverVisible(false)
	}

	return (
		<div className='flex items-center gap-2 p-2'>
			<SearchInput />

			<Button
				ref={anchorRef}
				onlyIcon
				iconLeft={IconFunnel}
				view='ghost'
				size='s'
				onClick={togglePopover}
			/>

			<FilterPopover
				anchorRef={anchorRef}
				isVisible={isPopoverVisible}
				onClickOutside={closePopover}
			/>
		</div>
	)
}
