import { Tabs } from '@consta/uikit/Tabs'
import React from 'react'

import { SIDEBAR_TABS } from '../model/constants'
import type { SidebarTabsProps } from '../model/types'

export const SidebarTabs: React.FC<SidebarTabsProps> = ({
	tabs = SIDEBAR_TABS,
	activeTab,
	onTabChange
}) => {
	return (
		<div className='flex w-full justify-center pt-4 pb-2'>
			<Tabs
				value={activeTab ?? tabs[0]}
				onChange={value => {
					if (value) onTabChange(value)
				}}
				items={tabs}
				size='m'
				view='clear'
				linePosition='bottom'
				getItemLabel={item => item.name}
				className='custom-sidebar-tabs'
			/>
		</div>
	)
}
