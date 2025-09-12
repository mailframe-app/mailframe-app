export interface SidebarTab {
	name: string
	value: string
}

export interface SidebarTabsProps {
	tabs: SidebarTab[]
	activeTab?: SidebarTab
	onTabChange: (tab: SidebarTab) => void
}
