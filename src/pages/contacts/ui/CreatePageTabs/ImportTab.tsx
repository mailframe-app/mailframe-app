import { Card } from '@consta/uikit/Card'

import ImportWizard from '@/features/import-contacts/ui/ImportWizard'

function ImportTab() {
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
			<ImportWizard />
		</Card>
	)
}

export default ImportTab
