import { Text } from '@consta/uikit/Text'

import { useModuleList } from '../../model/useModuleList'

import { ModuleSection } from './ModuleSection'

export const ModuleList = () => {
	const { sections, hasModules } = useModuleList()

	if (!hasModules) {
		return (
			<div className='flex h-full flex-col items-center justify-center px-3 py-2 text-gray-400'>
				<Text size='s' view='secondary'>
					Здесь ничего нет
				</Text>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-4 px-4 pb-8'>
			{sections.map(section => (
				<ModuleSection key={section.title} title={section.title} modules={section.modules} />
			))}
		</div>
	)
}
