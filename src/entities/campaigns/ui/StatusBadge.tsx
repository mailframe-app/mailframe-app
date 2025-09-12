import { IconAllDone } from '@consta/icons/IconAllDone'
import { IconArrowRedone } from '@consta/icons/IconArrowRedone'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import { Badge } from '@consta/uikit/Badge'
import { type FC } from 'react'

import { StatusConfig, type UIStatus } from '../lib/status'

type StatusBadgeProps = {
	statusText: UIStatus
}

const StatusBadge: FC<StatusBadgeProps> = ({ statusText }) => {
	const config = StatusConfig[statusText]

	if (!config) return null

	const { label, status, icon } = config

	const IconComponent =
		{
			IconEdit: IconEdit,
			IconArrowRedone: IconArrowRedone,
			IconAllDone: IconAllDone,
			IconTrash: IconTrash
		}[icon as string] || null

	return (
		<Badge
			label={label}
			iconLeft={IconComponent || undefined}
			size='s'
			status={status}
			view='stroked'
			form='round'
			className='relative m-0'
		/>
	)
}

export { StatusBadge }
