import { IconAdd } from '@consta/icons/IconAdd'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'

import { useAddSmtpSettingsModal } from '@/features/mail-settings/add-smtp-settings'
import { EditableSmtpSettingsCard } from '@/features/mail-settings/edit-smtp-settings'

import { useSmtpSettings } from '@/entities/mail-settings'

function SmtpSettingsPage() {
	const { smtpSettings, isLoading, testSmtpSettings } = useSmtpSettings()
	const { openAddSmtpSettingsModal } = useAddSmtpSettingsModal()

	const handleTest = (id: string) => {
		testSmtpSettings({ settingsId: id })
	}

	return (
		<Layout direction='column' flex={1}>
			<Card className='flex h-full w-full flex-col !rounded-lg' shadow={false}>
				{!isLoading && smtpSettings.length === 0 ? (
					<>
						<Text size='m' weight='bold' view='primary' className='mb-8'>
							Настройки почтового клиента
						</Text>
						<Text view='secondary' className='mb-8'>
							У вас пока нет настроек SMTP. Нажмите "Добавить", чтобы создать
							новые настройки.
						</Text>
					</>
				) : (
					<div className='mb-8 flex flex-col gap-4'>
						{smtpSettings.map(settings => (
							<EditableSmtpSettingsCard
								key={settings.id}
								settings={settings}
								onTest={handleTest}
							/>
						))}
					</div>
				)}
				<Button
					view='secondary'
					label='Добавить почтовый клиент'
					iconLeft={IconAdd}
					className='w-fit'
					onClick={openAddSmtpSettingsModal}
				/>
			</Card>
		</Layout>
	)
}

export const Component = SmtpSettingsPage
