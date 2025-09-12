import { ContextMenu } from '@consta/uikit/ContextMenu'
import React, { useRef, useState } from 'react'

import { DotsBtnShadow } from '@/shared/ui'

import { useCampaignActions } from '../model/use-campaign-actions'

import { CampaignCard, type CampaignListItem } from '@/entities/campaigns'

interface CampaignCardWithMenuProps {
	campaign: CampaignListItem
}

export function CampaignCardWithMenu({ campaign }: CampaignCardWithMenuProps) {
	const [isOpen, setIsOpen] = useState(false)
	const anchorRef = useRef<HTMLDivElement>(null)
	const menuItems = useCampaignActions(campaign)

	const handleButtonClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsOpen(!isOpen)
	}

	const actions = (
		<div ref={anchorRef}>
			<DotsBtnShadow onClick={handleButtonClick} />
		</div>
	)

	return (
		<>
			<CampaignCard campaign={campaign} actions={actions} />
			<ContextMenu
				items={menuItems}
				anchorRef={anchorRef as React.RefObject<HTMLElement>}
				isOpen={isOpen}
				onClickOutside={() => setIsOpen(false)}
				direction='downStartRight'
				className='!rounded-lg'
				offset='xs'
			/>
		</>
	)
}
