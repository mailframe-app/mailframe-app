import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'

import { type CampaignResponse } from '@/entities/campaigns'
import { useGroups } from '@/entities/contacts'
import { useSmtpSettings } from '@/entities/mail-settings'

interface InfoCardProps {
	campaign: CampaignResponse
}

export const InfoCard = ({ campaign }: InfoCardProps) => {
	// Получаем данные о SMTP настройках и группах контактов
	const { smtpSettings } = useSmtpSettings()
	const { data: groups } = useGroups()

	// Находим нужные объекты по ID
	const smtpSetting = useMemo(
		() => smtpSettings.find(s => s.id === campaign.smtpSettingsId),
		[smtpSettings, campaign.smtpSettingsId]
	)

	const group = useMemo(
		() =>
			groups?.items?.find((g: any) => g.id === campaign.contactGroupId) || null,
		[groups, campaign.contactGroupId]
	)

	// Извлекаем данные из объектов
	const { name, subject } = campaign
	const sender = smtpSetting?.smtpFromEmail || ''
	const senderName = smtpSetting?.smtpFromName || ''
	const recipient = group?.name || 'Выбранная группа контактов'

	return (
		<div className='p-4'>
			<div className='info-row relative mb-3 flex items-center pb-3'>
				<Text size='m' view='primary' weight='semibold' className='mr-20 w-50'>
					Название рассылки
				</Text>
				<Text size='m' view='primary'>
					{name || ''}
				</Text>
			</div>

			<div className='info-row relative mb-3 flex items-center pb-3'>
				<Text size='m' view='primary' weight='semibold' className='mr-20 w-50'>
					Отправитель
				</Text>
				<Text size='m' view='primary'>
					{sender || ''}
				</Text>
			</div>
			<div className='info-row relative mb-3 flex items-center pb-3'>
				<Text size='m' view='primary' weight='semibold' className='mr-20 w-50'>
					Имя
				</Text>
				<Text size='m' view='primary'>
					{senderName || ''}
				</Text>
			</div>

			<div className='info-row relative mb-3 flex items-center pb-3'>
				<Text size='m' view='primary' weight='semibold' className='mr-20 w-50'>
					Кому
				</Text>
				<Text size='m' view='primary'>
					{recipient || ''}
				</Text>
			</div>

			<div className='flex items-center pb-3'>
				<Text size='m' view='primary' weight='semibold' className='mr-20 w-50'>
					Тема
				</Text>
				<Text size='m' view='primary'>
					{subject || ''}
				</Text>
			</div>
		</div>
	)
}
