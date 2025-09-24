import { IconEdit } from '@consta/icons/IconEdit'
import { IconTest } from '@consta/icons/IconTest'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Switch } from '@consta/uikit/Switch'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'

import type { SmtpSettingsResponse } from '../api'

interface SmtpSettingsCardProps {
	settings: SmtpSettingsResponse
	onTest: (id: string) => void
	onEditToggle: () => void
	isEditing: boolean
	headerActions?: React.ReactNode // Опциональные действия для заголовка
	onFieldChange?: (field: string, value: any) => void // Обработчик изменения полей
}

export const SmtpSettingsCard = ({
	settings,
	onTest,
	onEditToggle,
	isEditing,
	headerActions,
	onFieldChange
}: SmtpSettingsCardProps) => {
	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='flex h-full w-full flex-col !rounded-lg bg-[var(--color-bg-default)]'
			shadow={false}
		>
			<div className='mb-4 flex items-center justify-between'>
				<Text size='m' weight='semibold' view='primary'>
					Почтовый сервер
				</Text>
				{headerActions || (
					<div className='flex items-center'>
						{/* Индикатор статуса */}
						<div
							className={`mr-2 h-3 w-3 rounded-full ${settings.isValid === undefined
								? 'bg-gray-300'
								: settings.isValid
									? 'bg-green-500'
									: 'bg-red-500'
								}`}
							title={
								settings.isValid === undefined
									? 'Статус неизвестен'
									: settings.isValid
										? 'Настройки валидны'
										: 'Настройки невалидны'
							}
						/>

						{/* Кнопка тестирования */}
						<Button
							view='clear'
							form='round'
							size='s'
							onlyIcon
							iconLeft={IconTest}
							onClick={() => onTest(settings.id)}
							title='Тестировать настройки'
						/>

						{/* Кнопка редактирования */}
						<Button
							view={isEditing ? 'primary' : 'clear'}
							form='round'
							size='s'
							onlyIcon
							iconLeft={IconEdit}
							onClick={onEditToggle}
							title={isEditing ? 'Завершить редактирование' : 'Редактировать'}
						/>
					</div>
				)}
			</div>

			<div className='grid grid-cols-12 gap-x-4'>
				{/* SMTP хост, порт и безопасное соединение в одной строке */}
				<div className='col-span-6 mb-4'>
					<Text view='secondary' size='s' className='mb-2'>
						Хост SMTP
					</Text>
					<TextField
						value={settings.smtpHost}
						readOnly={!isEditing}
						size='m'
						className='w-full'
						onChange={
							isEditing && onFieldChange
								? value => onFieldChange('smtpHost', value || '')
								: undefined
						}
					/>
				</div>
				<div className='col-span-2 mb-4'>
					<Text view='secondary' size='s' className='mb-2'>
						Порт SMTP
					</Text>
					<TextField
						value={String(settings.smtpPort)}
						readOnly={!isEditing}
						size='m'
						className='w-full'
						type='number'
						onChange={
							isEditing && onFieldChange
								? value => onFieldChange('smtpPort', Number(value) || 0)
								: undefined
						}
					/>
				</div>
				<div className='col-span-4 mt-3 flex items-center'>
					<Switch
						checked={settings.smtpSecure}
						readOnly={!isEditing}
						label='Безопасное соединение (TLS/SSL)'
						onChange={
							isEditing && onFieldChange
								? e => onFieldChange('smtpSecure', e.target.checked)
								: undefined
						}
					/>
				</div>

				{/* Пользователь и пароль SMTP в одной строке */}
				<div className='col-span-6 mb-4'>
					<Text view='secondary' size='s' className='mb-2'>
						Пользователь SMTP
					</Text>
					<TextField
						value={settings.smtpUser}
						readOnly={!isEditing}
						size='m'
						className='w-full'
						onChange={
							isEditing && onFieldChange
								? value => onFieldChange('smtpUser', value || '')
								: undefined
						}
					/>
				</div>
				<div className='col-span-6 mb-4'>
					<Text view='secondary' size='s' className='mb-2'>
						Пароль SMTP
					</Text>
					<TextField
						value={isEditing ? '' : '••••••••'}
						placeholder={
							isEditing ? 'Введите новый пароль или оставьте пустым' : ''
						}
						readOnly={!isEditing}
						size='m'
						type='password'
						className='w-full'
						onChange={
							isEditing && onFieldChange
								? value => onFieldChange('smtpPassword', value || '')
								: undefined
						}
					/>
				</div>

				{/* Отправитель */}
				<div className='col-span-12 mt-2 mb-4'>
					<Text size='m' weight='semibold' view='primary'>
						Отправитель
					</Text>
				</div>

				{/* Email отправителя и имя отправителя в одной строке */}
				<div className='col-span-6 mb-4'>
					<Text view='secondary' size='s' className='mb-2'>
						Email отправителя
					</Text>
					<TextField
						value={settings.smtpFromEmail}
						readOnly={!isEditing}
						size='m'
						className='w-full'
						onChange={
							isEditing && onFieldChange
								? value => onFieldChange('smtpFromEmail', value || '')
								: undefined
						}
					/>
				</div>
				<div className='col-span-6 mb-4'>
					<Text view='secondary' size='s' className='mb-2'>
						Имя отправителя
					</Text>
					<TextField
						value={settings.smtpFromName}
						readOnly={!isEditing}
						size='m'
						className='w-full'
						onChange={
							isEditing && onFieldChange
								? value => onFieldChange('smtpFromName', value || '')
								: undefined
						}
					/>
				</div>

				{/* Использовать по умолчанию */}
				<div className='col-span-12 mt-2'>
					<Switch
						checked={settings.isDefault}
						readOnly={!isEditing}
						label='Использовать по умолчанию'
						onChange={
							isEditing && onFieldChange
								? e => onFieldChange('isDefault', e.target.checked)
								: undefined
						}
					/>
				</div>
			</div>
		</Card>
	)
}
