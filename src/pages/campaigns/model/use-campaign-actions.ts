import { IconCancel } from '@consta/icons/IconCancel'
import { IconCopy } from '@consta/icons/IconCopy'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconEye } from '@consta/icons/IconEye'
import { IconRevert } from '@consta/icons/IconRevert'
import { IconTrash } from '@consta/icons/IconTrash'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCancelCampaignConfirm } from '@/features/campaign/cancel-campaign'
import { useCopyCampaign } from '@/features/campaign/copy-campaign'
import { useDeleteCampaignConfirm } from '@/features/campaign/delete-campaign'
import { useReopenCampaignConfirm } from '@/features/campaign/reopen-campaign'

import { type CampaignListItem } from '@/entities/campaigns'

export function useCampaignActions(campaign: CampaignListItem) {
	const navigate = useNavigate()
	const { openDeleteConfirm } = useDeleteCampaignConfirm()
	const { copyCampaign, isPending: isCopying } = useCopyCampaign()
	const { openCancelConfirm, isPending: isCanceling } =
		useCancelCampaignConfirm()
	const { openReopenConfirm, isPending: isReopening } =
		useReopenCampaignConfirm()

	const menuItems = useMemo(() => {
		const isActionInProgress = isCopying || isCanceling || isReopening

		const editAction = {
			key: 'edit',
			label: 'Редактировать',
			leftIcon: IconEdit,
			onClick: () => navigate(`/campaigns/${campaign.id}/edit`),
			disabled: isActionInProgress
		}
		const copyAction = {
			key: 'copy',
			label: 'Копировать',
			leftIcon: IconCopy,
			onClick: () => copyCampaign(campaign),
			disabled: isActionInProgress
		}
		const deleteAction = {
			key: 'delete',
			label: 'Удалить',
			leftIcon: IconTrash,
			status: 'alert' as const,
			onClick: () => {
				openDeleteConfirm(campaign)
			},
			disabled: isActionInProgress
		}
		const viewAction = {
			key: 'view',
			label: 'Просмотр',
			leftIcon: IconEye,
			onClick: () => navigate(`/campaigns/${campaign.id}/overview`),
			disabled: isActionInProgress
		}
		const cancelAction = {
			key: 'cancel',
			label: 'Отменить',
			leftIcon: IconCancel,
			status: 'alert' as const,
			onClick: () => openCancelConfirm(campaign),
			disabled: isActionInProgress
		}
		const restoreAction = {
			key: 'restore',
			label: 'Восстановить',
			leftIcon: IconRevert,
			onClick: () => openReopenConfirm(campaign),
			disabled: isActionInProgress
		}

		switch (campaign.status) {
			case 'DRAFT':
				return [editAction, copyAction, deleteAction]
			case 'QUEUED':
			case 'SENDING':
				return [viewAction, cancelAction]
			case 'SCHEDULED':
				return [viewAction, copyAction, cancelAction]
			case 'SENT':
				return [viewAction, copyAction]
			case 'CANCELED':
				return [viewAction, copyAction, restoreAction, deleteAction]
			default:
				return []
		}
	}, [
		campaign,
		navigate,
		openDeleteConfirm,
		copyCampaign,
		isCopying,
		openCancelConfirm,
		isCanceling,
		openReopenConfirm,
		isReopening
	])

	return menuItems
}
