import { Select } from '@consta/uikit/Select'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import React, { useMemo } from 'react'

import {
	type ContactListItemDto,
	ContactStatus,
	useContactFields
} from '../../../../entities/contacts'

interface ContactEditFormProps {
	contact: ContactListItemDto
	formData: Record<string, any>
	onChange: (field: string, value: any) => void
	headerActions?: React.ReactNode
}

export const ContactEditForm: React.FC<ContactEditFormProps> = ({
	contact,
	formData,
	onChange,
	headerActions
}) => {
	const { data: fieldsData } = useContactFields()

	// Статусы для селекта
	const statusOptions = useMemo(
		() =>
			Object.keys(ContactStatus).map(k => ({
				label: k,
				value: (ContactStatus as any)[k]
			})),
		[]
	)

	// Получаем поля для отображения - КОПИРУЕМ ЛОГИКУ ИЗ openEditForRow
	const fieldsToRender = useMemo(() => {
		if (!fieldsData?.fields) return []

		// Точно как в openEditForRow: берем только видимые поля, исключаем email и status
		return (fieldsData.fields || [])
			.filter(
				(f: any) => f.isVisible && f.key !== 'email' && f.key !== 'status'
			)
			.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
			.map((f: any) => ({
				key: f.key,
				name: f.name,
				fieldType: f.fieldType,
				fieldMetadata: f.fieldMetadata
			}))
	}, [fieldsData])

	// Получаем текущие значения полей - как в EditContactModal
	const currentFields = useMemo(() => {
		const result: Record<string, string> = {}
		fieldsToRender.forEach(f => {
			const contactValue = (contact as any)[f.key]
			if (typeof contactValue === 'string') {
				result[f.key] = contactValue
			}
		})
		return result
	}, [contact, fieldsToRender])

	return (
		<div
			style={{
				backgroundColor: 'var(--color-bg-default)',
				padding: 'var(--space-m)',
				borderRadius: 'var(--control-radius)',
				border: '1px solid var(--color-bg-border)'
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 'var(--space-m)'
				}}
			>
				<Text size='m' weight='semibold'>
					Основная информация
				</Text>
				{headerActions}
			</div>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 'var(--space-m)'
				}}
			>
				{/* Email поле */}
				<div>
					<Text
						size='s'
						view='secondary'
						style={{ marginBottom: 'var(--space-xs)' }}
					>
						Email
					</Text>
					<TextField
						size='m'
						value={formData.email || contact.email || ''}
						onChange={value => onChange('email', value || '')}
						placeholder='example@email.com'
					/>
				</div>

				{/* Статус */}
				<div>
					<Text
						size='s'
						view='secondary'
						style={{ marginBottom: 'var(--space-xs)' }}
					>
						Статус
					</Text>
					<Select
						size='m'
						items={statusOptions}
						value={statusOptions.find(
							opt => opt.value === (formData.status || contact.status)
						)}
						onChange={option => onChange('status', option?.value)}
						getItemLabel={item => item.label}
						getItemKey={item => item.value}
						placeholder='Выберите статус'
					/>
				</div>

				{/* Динамические поля - КАК В EditContactModal */}
				{fieldsToRender.map(field => {
					// Текущее значение поля
					const currentValue = currentFields[field.key] || ''
					// Значение из формы (если есть изменения)
					const formFieldsValue =
						(formData.fields as Record<string, string>) || {}
					const displayValue =
						formFieldsValue[field.key] !== undefined
							? formFieldsValue[field.key]
							: currentValue

					return (
						<div key={field.key}>
							<Text
								size='s'
								view='secondary'
								style={{ marginBottom: 'var(--space-xs)' }}
							>
								{field.name}
							</Text>
							{field.fieldType === 'SELECT' ? (
								<Select
									size='m'
									items={field.fieldMetadata?.options || []}
									value={field.fieldMetadata?.options?.find(
										(opt: any) => opt.value === displayValue
									)}
									onChange={option => {
										// Обновляем fields как в EditContactModal
										const updatedFields = {
											...(formData.fields || {}),
											[field.key]: option?.value || ''
										}
										onChange('fields', updatedFields)
									}}
									getItemLabel={(item: any) => item.label}
									getItemKey={(item: any) => item.value}
									placeholder={`Выберите ${field.name.toLowerCase()}`}
								/>
							) : (
								<TextField
									size='m'
									value={displayValue}
									onChange={value => {
										// Обновляем fields как в EditContactModal
										const updatedFields = {
											...(formData.fields || {}),
											[field.key]: value || ''
										}
										onChange('fields', updatedFields)
									}}
									placeholder={`Введите ${field.name.toLowerCase()}`}
								/>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
