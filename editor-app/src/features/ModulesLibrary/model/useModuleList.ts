import { useMemo } from 'react'

import { blocksToModules } from '../utils/mappers'

import { useReusableBlocksStore } from '@/entities/ReusableBlocks'

export const useModuleList = () => {
	const {
		favoriteBlocks,
		userBlocks,
		systemBlocks,
		showFavorites,
		showUserBlocks,
		showSystemBlocks,
		stats
	} = useReusableBlocksStore()

	const sections = useMemo(() => {
		const allSections = [
			{
				title: 'Избранное',
				count: stats.totalFavorites,
				modules: showFavorites ? blocksToModules(favoriteBlocks) : [],
				isVisible: showFavorites && favoriteBlocks.length > 0
			},
			{
				title: 'Сохраненные',
				count: stats.totalUserBlocks,
				modules: showUserBlocks ? blocksToModules(userBlocks) : [],
				isVisible: showUserBlocks && userBlocks.length > 0
			},
			{
				title: 'Библиотека',
				count: stats.totalSystemBlocks,
				modules: showSystemBlocks ? blocksToModules(systemBlocks) : [],
				isVisible: showSystemBlocks && systemBlocks.length > 0
			}
		]
		return allSections.filter(section => section.isVisible)
	}, [
		favoriteBlocks,
		userBlocks,
		systemBlocks,
		showFavorites,
		showUserBlocks,
		showSystemBlocks,
		stats
	])

	const hasModules = sections.length > 0

	return {
		sections,
		hasModules
	}
}
