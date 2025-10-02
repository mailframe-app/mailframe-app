import { IconAlert } from '@consta/icons/IconAlert'
import { IconClose } from '@consta/icons/IconClose'
import { IconInfoCircle } from '@consta/icons/IconInfoCircle'
import { IconThumbUp } from '@consta/icons/IconThumbUp'
import { IconWarning } from '@consta/icons/IconWarning'
import { Button } from '@consta/uikit/Button'
import { toast } from 'sonner'

type CustomToastType = 'info' | 'warning' | 'success' | 'error'

export interface showCustomToastProps {
	title: string
	description?: string
	type?: CustomToastType
}

const typeToClassName: Record<CustomToastType, string> = {
	info: 'custom-toast-info',
	warning: 'custom-toast-warning',
	success: 'custom-toast-success',
	error: 'custom-toast-error'
}

const typeToIcon: Record<CustomToastType, React.ReactNode> = {
	success: <IconThumbUp />,
	error: <IconAlert />,
	info: <IconInfoCircle />,
	warning: <IconWarning />
}

export function showCustomToast({
	title,
	description,
	type = 'info'
}: showCustomToastProps) {
	const className = typeToClassName[type]
	const icon = typeToIcon[type]

	toast.custom(
		t => (
			<div className='custom-toast-content-wrapper'>
				<span className='custom-toast-icon' aria-hidden>
					{icon}
				</span>
				<div className='custom-toast-text-content'>
					<div className='custom-toast-title'>{title}</div>
					{description && (
						<p className='custom-toast-description'>{description}</p>
					)}
				</div>
				<Button
					size='xs'
					label='Закрыть'
					view='clear'
					form='round'
					onlyIcon
					iconLeft={IconClose}
					className='custom-toast-custom-dismiss'
					onClick={() => toast.dismiss(t)}
				/>
			</div>
		),
		{
			className: `${className} custom-toast`
		}
	)
}
