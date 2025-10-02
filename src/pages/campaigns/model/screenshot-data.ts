import { type CampaignListItem } from '@/entities/campaigns'

// Mock data for beautiful screenshot
export const mockCampaignsData: {
	page: number
	limit: number
	total: number
	items: CampaignListItem[]
} = {
	page: 1,
	limit: 10,
	total: 45,
	items: [
		// 1. Самая свежая - Черновик (DRAFT) - только что обновлен
		{
			id: 'draft-1',
			name: 'Специальное предложение',
			status: 'DRAFT',
			subject: 'Скидка 50% на все товары!',
			createdAt: '2024-09-28T14:30:00Z',
			updatedAt: '2024-10-02T10:00:00Z',
			recipientsCount: 0,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-2', name: 'VIP клиенты' }
		},
		// 2. Завершенная (SENT) - вчера обновлена
		{
			id: 'sent-1',
			name: 'Итоги квартала',
			status: 'SENT',
			subject: 'Итоги работы за Q3 2024',
			createdAt: '2024-08-30T10:00:00Z',
			sentAt: '2024-09-30T09:00:00Z',
			updatedAt: '2024-10-01T15:30:00Z',
			recipientsCount: 4000,
			sentCount: 4000,
			opensCount: 3320,
			clicksCount: 791,
			openRate: 0.83,
			clickRate: 0.22,
			group: { id: 'group-7', name: 'Корпоративные клиенты' }
		},
		// 3. Отложенная (SCHEDULED) - позавчера обновлена
		{
			id: 'scheduled-1',
			name: 'Праздничная акция',
			status: 'SCHEDULED',
			subject: '🎄 Праздничная распродажа начинается!',
			createdAt: '2024-09-18T16:45:00Z',
			scheduledAt: '2024-10-10T12:00:00Z',
			updatedAt: '2024-09-30T14:20:00Z',
			recipientsCount: 3500,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-4', name: 'Все клиенты' }
		},
		// 4. Черновик (DRAFT) - 3 дня назад
		{
			id: 'draft-2',
			name: 'Обновление продукта',
			status: 'CANCELED',
			subject: 'Новая версия нашего приложения',
			createdAt: '2024-09-25T09:15:00Z',
			updatedAt: '2024-09-29T11:45:00Z',
			recipientsCount: 0,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-3', name: 'Разработчики' }
		},
		// 5. Завершенная (SENT) - 4 дня назад
		{
			id: 'sent-2',
			name: 'Обратная связь',
			status: 'SENT',
			subject: 'Расскажите о вашем опыте работы с нами',
			createdAt: '2024-08-30T10:00:00Z',
			sentAt: '2024-09-30T09:00:00Z',
			updatedAt: '2024-10-01T15:30:00Z',
			recipientsCount: 950,
			sentCount: 950,
			opensCount: 855,
			clicksCount: 155,
			openRate: 0.9,
			clickRate: 0.17,
			group: { id: 'group-5', name: 'Активные пользователи' }
		},
		// 6. Еженедельный дайджест (SCHEDULED) - 5 дней назад
		{
			id: 'scheduled-2',
			name: 'Еженедельный дайджест',
			status: 'SCHEDULED',
			subject: 'Ваш еженедельный дайджест новостей',
			createdAt: '2024-09-20T08:00:00Z',
			scheduledAt: '2024-10-05T09:00:00Z',
			updatedAt: '2024-09-27T09:30:00Z',
			recipientsCount: 1250,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-6', name: 'Подписчики дайджеста' }
		},
		// 7. Отправляющаяся (SENDING) - 6 дней назад
		{
			id: 'sent-3',
			name: 'Новый блог-пост',
			status: 'SENT',
			subject: 'Как оптимизировать производительность приложения',
			createdAt: '2024-08-25T14:30:00Z',
			sentAt: '2024-09-25T10:00:00Z',
			updatedAt: '2024-09-26T18:20:00Z',
			recipientsCount: 5000,
			sentCount: 5000,
			opensCount: 2000,
			clicksCount: 500,
			openRate: 0.4,
			clickRate: 0.25,
			group: { id: 'group-8', name: 'Разработчики' }
		},
		// 8. В очереди (QUEUED) - неделя назад
		{
			id: 'queued-1',
			name: 'Техническое обслуживание',
			status: 'QUEUED',
			subject: 'Запланированные работы на сервере',
			createdAt: '2024-09-15T11:20:00Z',
			scheduledAt: '2024-10-02T02:00:00Z',
			updatedAt: '2024-09-25T14:10:00Z',
			recipientsCount: 850,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-9', name: 'Техническая поддержка' }
		},
		// 9. Отправляющаяся (SENDING) - 8 дней назад
		{
			id: 'sending-1',
			name: 'Обновление условий',
			status: 'SENDING',
			subject: 'Изменения в пользовательском соглашении',
			createdAt: '2024-09-12T13:10:00Z',
			scheduledAt: '2024-10-01T15:00:00Z',
			updatedAt: '2024-09-24T16:45:00Z',
			recipientsCount: 2100,
			sentCount: 1200,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-10', name: 'Активные пользователи' }
		},
		// 10. Черновик (DRAFT) - 9 дней назад
		{
			id: 'draft-3',
			name: 'Добро пожаловать в нашу компанию',
			status: 'DRAFT',
			subject: 'Добро пожаловать в нашу команду!',
			createdAt: '2024-10-01T10:00:00Z',
			updatedAt: '2024-09-23T11:30:00Z',
			recipientsCount: 0,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-1', name: 'Новые клиенты' }
		},
		// 11. Отменённая (CANCELED) - 10 дней назад
		{
			id: 'canceled-1',
			name: 'Отменённая акция',
			status: 'CANCELED',
			subject: 'Акция отменена по техническим причинам',
			createdAt: '2024-08-15T09:45:00Z',
			scheduledAt: '2024-09-15T14:00:00Z',
			updatedAt: '2024-09-22T13:15:00Z',
			recipientsCount: 2800,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-11', name: 'Акционные подписчики' }
		},
		// 12. Отменённая (CANCELED) - 11 дней назад
		{
			id: 'canceled-2',
			name: 'Старый дайджест',
			status: 'CANCELED',
			subject: 'Ежемесячный обзор рынка (отменён)',
			createdAt: '2024-08-10T12:00:00Z',
			scheduledAt: '2024-09-10T10:00:00Z',
			updatedAt: '2024-09-21T09:45:00Z',
			recipientsCount: 1200,
			sentCount: 0,
			opensCount: 0,
			clicksCount: 0,
			openRate: 0,
			clickRate: 0,
			group: { id: 'group-12', name: 'Аналитики' }
		}
	]
}

// Функция для фильтрации и сортировки моковых данных
export function getFilteredMockData({
	activeTab,
	statuses,
	search,
	sortBy,
	sortOrder,
	page,
	limit
}: {
	activeTab: { status?: string[] } | null
	statuses: string[]
	search: string
	sortBy: string
	sortOrder: string
	page: number
	limit: number
}) {
	let filteredItems = mockCampaignsData.items

	// Filter by status
	const currentStatuses = activeTab?.status ?? statuses
	if (currentStatuses && currentStatuses.length > 0) {
		filteredItems = filteredItems.filter(item =>
			currentStatuses.includes(item.status)
		)
	}

	// Filter by search
	if (search) {
		const searchLower = search.toLowerCase()
		filteredItems = filteredItems.filter(
			item =>
				item.name.toLowerCase().includes(searchLower) ||
				item.subject?.toLowerCase().includes(searchLower)
		)
	}

	// Sort
	filteredItems.sort((a, b) => {
		let aValue: any, bValue: any

		switch (sortBy) {
			case 'name':
				aValue = a.name.toLowerCase()
				bValue = b.name.toLowerCase()
				break
			case 'createdAt':
				aValue = new Date(a.createdAt)
				bValue = new Date(b.createdAt)
				break
			case 'updatedAt':
				aValue = new Date(a.updatedAt)
				bValue = new Date(b.updatedAt)
				break
			case 'status':
				aValue = a.status
				bValue = b.status
				break
			default:
				// По умолчанию сортируем по updatedAt (дате обновления)
				aValue = new Date(a.updatedAt)
				bValue = new Date(b.updatedAt)
		}

		if (sortOrder === 'asc') {
			return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
		} else {
			return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
		}
	})

	// Paginate
	const startIndex = (page - 1) * limit
	const endIndex = startIndex + limit
	const paginatedItems = filteredItems.slice(startIndex, endIndex)

	return {
		page,
		limit,
		total: filteredItems.length,
		items: paginatedItems
	}
}

// Флаг для переключения между реальными и mock данными
export const USE_MOCK_DATA = false
