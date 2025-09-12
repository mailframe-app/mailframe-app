import { Text } from '@consta/uikit/Text'
import React from 'react'

import type { Module } from '../../model/types'

import { ModuleCard } from './ModuleCard'

interface ModuleSectionProps {
	title: string
	modules: Module[]
}

export const ModuleSection: React.FC<ModuleSectionProps> = ({ title, modules }) => {
	return (
		<section>
			<div className='mt-2 mb-2 flex items-center justify-between'>
				<Text size='s' view='primary' weight='semibold'>
					{title}
				</Text>
			</div>
			<div className='mb-3 border-b border-gray-200' />
			<div className='flex flex-wrap gap-2'>
				{modules.map(module => (
					<ModuleCard key={module.id} module={module} />
				))}
			</div>
		</section>
	)
}
