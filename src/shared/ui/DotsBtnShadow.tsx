import { IconKebab } from '@consta/icons/IconKebab'
import React, { type FC } from 'react'

type DotsBtnShadowProps = {
	onClick: (e: React.MouseEvent) => void
}

const DotsBtnShadow: FC<DotsBtnShadowProps> = ({ onClick }) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onClick(e as any)
		}
	}
	return (
		<div
			role='button'
			tabIndex={0}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			className='flex cursor-pointer rounded-[6px] border-none bg-transparent p-[8px]'
			style={{
				boxShadow: ' 0px 2px 8px 0px #00203329,0px 2px 2px 0px #00203305'
			}}
		>
			<IconKebab view='link' />
		</div>
	)
}

export { DotsBtnShadow }
