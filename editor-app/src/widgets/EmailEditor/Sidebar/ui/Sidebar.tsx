import { Text } from '@consta/uikit/Text'
import React, { useState } from 'react'

import { ComponentLibrary } from '@/features/ComponentLibrary'
import { ModulesLibrary } from '@/features/ModulesLibrary'

import { SIDEBAR_TABS } from '../model/constants'
import type { SidebarTab } from '../model/types'

import { SidebarTabs } from './SidebarTabs'

export const Sidebar: React.FC = () => {
	const [activeTab, setActiveTab] = useState<SidebarTab>(SIDEBAR_TABS[0])

	return (
		<div className='flex h-full flex-col items-center bg-[var(--color-bg-default)]'>
			<SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={SIDEBAR_TABS} />

			{activeTab.value === 'content' ? (
				<ComponentLibrary />
			) : activeTab.value === 'modules' ? (
				<div className='flex w-full flex-1 overflow-y-auto'>
					<ModulesLibrary />
				</div>
			) : (
				<div className='flex h-full flex-col items-center justify-center text-[var(--color-typo-secondary)]'>
					<Text size='s'>Неизвестная вкладка</Text>
				</div>
			)}
		</div>
	)
}
