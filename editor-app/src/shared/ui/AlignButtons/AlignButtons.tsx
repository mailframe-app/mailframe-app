import { Button } from '@consta/uikit/Button'
import React from 'react'

import type { Align } from '@/shared/types/align'

import type { AlignOption } from './alignOptions.types'

interface AlignButtonsProps {
	options: AlignOption[]
	value: Align
	onChange: (v: 'left' | 'center' | 'right') => void
}

export const AlignButtons: React.FC<AlignButtonsProps> = ({ options, value, onChange }) => (
	<div className='flex gap-3.5'>
		{options.map(({ Icon, value: v }) => (
			<Button
				key={v}
				size='s'
				view={value === v ? 'primary' : 'ghost'}
				iconLeft={Icon}
				iconSize='s'
				onClick={() => onChange(v)}
			/>
		))}
	</div>
)
