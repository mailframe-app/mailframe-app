import React from 'react'

import { COMPONENTS } from '../model/constants'
import type { ComponentGridProps } from '../model/types'

import { ComponentItem } from './ComponentItem'

export const ComponentLibrary: React.FC<Partial<ComponentGridProps>> = ({
	components = COMPONENTS
}) => {
	return (
		<div className='flex flex-wrap items-center justify-center gap-2'>
			{components.map((item, i) => (
				<ComponentItem
					key={i}
					icon={item.icon}
					title={item.title}
					component={item.component}
					componentProps={item.componentProps}
					isCanvas={item.isCanvas}
				/>
			))}
		</div>
	)
}
