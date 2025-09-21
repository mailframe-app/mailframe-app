import { PRIVATE_ROUTES } from '@/shared/constants'

export type MainLayoutRoutes = Pick<
	typeof PRIVATE_ROUTES,
	'CONTACTS' | 'CAMPANIES' | 'TEMPLATES'
>

export interface CardLinkProps {
	isHovered: boolean
	onHover: () => void
	text: string
	title: string
	description: string
	imageUrl: string
	position: 'image-top' | 'image-bottom'
	url: MainLayoutRoutes[keyof MainLayoutRoutes]
	className?: string
	onButtonClick?: () => void
}

export const CardId = {
	CONTACTS: 1,
	TEMPLATES: 2,
	CAMPAIGNS: 3
} as const

export type CardIdType = (typeof CardId)[keyof typeof CardId]

export interface UseActionButtonsReturn {
	hoveredCard: CardIdType
	setHoveredCard: (id: CardIdType) => void
	isContactsModalOpen: boolean
	setIsContactsModalOpen: (open: boolean) => void
	handleContactsButtonClick: () => void
	handleTemplateButtonClick: () => void
	handleCampaignButtonClick: () => void
}

export interface UseDashboardDataReturn {
	dateRange: [Date, Date]
}

export interface DashboardCardData {
	id: CardIdType
	title: string
	description: string
	text: string
	imageUrl: string
	position: 'image-top' | 'image-bottom'
	url: MainLayoutRoutes[keyof MainLayoutRoutes]
	className?: string
}
