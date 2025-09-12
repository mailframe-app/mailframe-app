export interface PropertiesPanelTab {
	name: string
	value: string
}

export interface PropertiesPanelTabsProps {
	tabs: PropertiesPanelTab[]
	activeTab?: PropertiesPanelTab
	onTabChange: (tab: PropertiesPanelTab) => void
}
