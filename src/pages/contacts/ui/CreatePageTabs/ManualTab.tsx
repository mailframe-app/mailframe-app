import { Card } from '@consta/uikit/Card'

import ManualCreateForm from '@/features/contacts-bulk/manual-create/ui/ManualCreateForm'

function ManualTab() {
	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='!rounded-lg'
			style={{
				backgroundColor: 'var(--color-bg-default)'
			}}
			shadow={false}
		>
			<ManualCreateForm />
		</Card>
	)
}

export default ManualTab
