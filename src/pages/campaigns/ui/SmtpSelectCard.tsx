import { useEffect, useMemo, useRef } from 'react'

import { PRIVATE_ROUTES } from '@/shared/constants'

import { SelectCard, type SelectItem } from './SelectCard'
import {
	type CampaignResponse,
	useUpdateCampaignMutation
} from '@/entities/campaigns'
import { useSmtpSettings } from '@/entities/mail-settings'

type SmtpSelectCardProps = {
	campaign: CampaignResponse
}

export function SmtpSelectCard({ campaign }: SmtpSelectCardProps) {
	const { smtpSettings, isLoading: smtpLoading } = useSmtpSettings()
	const updateCampaignMutation = useUpdateCampaignMutation()
	const isDefaultSet = useRef(false)

	const campaignSmtpId = campaign.smtpSettingsId
	const isCampaignLoaded = !!campaign

	useEffect(() => {
		// Устанавливаем SMTP по умолчанию, если он не выбран и настройки доступны
		if (
			!isDefaultSet.current &&
			isCampaignLoaded &&
			!campaignSmtpId &&
			smtpSettings.length > 0
		) {
			const defaultSmtp = smtpSettings[0]
			if (defaultSmtp) {
				isDefaultSet.current = true
				updateCampaignMutation.mutate({
					id: campaign.id,
					payload: { smtpSettingsId: defaultSmtp.id }
				})
			}
		}
	}, [
		isCampaignLoaded,
		campaignSmtpId,
		smtpSettings,
		campaign.id,
		updateCampaignMutation
	])

	const items = useMemo(
		() =>
			smtpSettings.map(s => ({
				id: s.id,
				label: `${s.smtpFromEmail} - ${s.smtpFromName}`
			})),
		[smtpSettings]
	)

	const value = useMemo(
		() => items.find(item => item.id === campaign.smtpSettingsId) || null,
		[items, campaign.smtpSettingsId]
	)

	const handleSelect = (item: SelectItem | null) => {
		if (campaign && item) {
			updateCampaignMutation.mutate({
				id: campaign.id,
				payload: { smtpSettingsId: item.id }
			})
		}
	}

	return (
		<SelectCard
			title='Отправитель'
			description='Кто отправляет рассылку?'
			selectLabel='SMTP-сервер'
			selectPlaceholder='Выберите SMTP-сервер'
			items={items}
			value={value}
			onSelect={handleSelect}
			isLoading={smtpLoading}
			stepNumber={1}
			selectHelpText='Для создания рассылки необходимо заполнить'
			linkText='настройки в профиле'
			linkUrl={PRIVATE_ROUTES.MAIL_SETTINGS}
		/>
	)
}
