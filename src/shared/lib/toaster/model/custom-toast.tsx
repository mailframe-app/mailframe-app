import { IconClose } from '@consta/icons/IconClose'
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

export function showCustomToast({
	title,
	description,
	type = 'info'
}: showCustomToastProps) {
	const className = typeToClassName[type]

	toast.custom(
		t => (
			<div className='custom-toast-content-wrapper'>
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
			className
		}
	)
}
