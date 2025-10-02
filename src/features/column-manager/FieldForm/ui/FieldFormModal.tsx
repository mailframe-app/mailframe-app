import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Checkbox } from '@consta/uikit/Checkbox'
import { Text } from '@consta/uikit/Text'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { showCustomToast } from '@/shared/lib/toaster'
import { ModalShell, TextFieldForm } from '@/shared/ui'

import {
	type FieldFormValues,
	FieldType,
	buildFieldFormSchema
} from '../model/schema'

import type { CreateFieldDto, UpdateFieldDto } from '@/entities/contacts'

export type FieldFormModalProps = {
	isOpen: boolean
	onClose: () => void
	loading?: boolean
	title: string
	description?: string
	initial: FieldFormValues & { id?: string }
	onSubmit: (payload: Partial<CreateFieldDto> & Partial<UpdateFieldDto>) => void
	confirmLabel?: string
	cancelLabel?: string
}

const FieldFormModal: React.FC<FieldFormModalProps> = ({
	isOpen,
	onClose,
	loading,
	title,
	description,
	initial,
	onSubmit,
	confirmLabel = 'Сохранить',
	cancelLabel = 'Отмена'
}) => {
	const isSystem = Boolean((initial as any)?.isSystem)
	const initialType = ((initial as any)?.fieldType ?? 'TEXT') as z.infer<
		typeof FieldType
	>
	const schema = useMemo(
		() => buildFieldFormSchema({ isSystem, initialFieldType: initialType }),
		[isSystem, initialType]
	)

	const { control, handleSubmit, watch, formState, getValues, setValue } =
		useForm<any>({
			resolver: zodResolver(schema) as any,
			mode: 'onChange',
			reValidateMode: 'onChange',
			criteriaMode: 'all',
			defaultValues: {
				name: (initial as any)?.name ?? '',
				key: (initial as any)?.key ?? '',
				fieldType: (initial as any)?.fieldType ?? 'TEXT',
				isRequired: (initial as any)?.isRequired ?? false,
				isVisible: (initial as any)?.isVisible ?? true,
				columnWidth: (initial as any)?.columnWidth ?? 150,
				isSystem: isSystem,
				fieldMetadata:
					(initial as any)?.fieldMetadata ??
					(initialType === 'SELECT'
						? {
								allowMultiple: false,
								disableSuggestions: false,
								options: [{ label: '', value: '' }]
							}
						: undefined)
			}
		})

	const optionsArray = useFieldArray({
		control: control as any,
		name: 'fieldMetadata.options' as any
	})

	const currentType = (watch('fieldType') as any) ?? initialType
	const showKeyAndType = !isSystem
	const showSelectMeta = currentType === 'SELECT'

	useEffect(() => {
		if (showSelectMeta) {
			const fm: any = getValues('fieldMetadata' as any)
			if (!fm || !Array.isArray(fm.options)) {
				setValue(
					'fieldMetadata' as any,
					{
						allowMultiple: false,
						disableSuggestions: false,
						options: [{ label: '', value: '' }]
					},
					{ shouldValidate: true, shouldTouch: false }
				)
			} else if (fm.options.length === 0 && optionsArray.fields.length === 0) {
				optionsArray.append({ label: '', value: '' } as any, {
					shouldFocus: true
				})
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showSelectMeta])

	type FieldUpsertDto = Partial<CreateFieldDto> & Partial<UpdateFieldDto>

	const onSubmitInternal = (values: any) => {
		const payload: FieldUpsertDto = {
			name: String(values.name || '').trim(),
			isRequired: Boolean(values.isRequired),
			isVisible: Boolean(values.isVisible ?? true),
			columnWidth: Number(values.columnWidth ?? 150)
		}
		if (showKeyAndType) {
			;(payload as any).key = String(values.key || '').trim()
			;(payload as any).fieldType = values.fieldType
		}
		if (
			(showKeyAndType ? values.fieldType : initialType) === 'SELECT' &&
			(values as any).fieldMetadata
		) {
			const fm: any = (values as any).fieldMetadata
			;(payload as any).fieldMetadata = {
				allowMultiple: Boolean(fm.allowMultiple),
				disableSuggestions: Boolean(fm.disableSuggestions),
				options: (fm.options || []).map((o: any) => ({
					label: String(o.label || ''),
					value: String(o.value || '')
				}))
			}
		}
		onSubmit(payload)
	}

	const onInvalid = () =>
		showCustomToast({
			title: 'Ошибка',
			description: 'Проверьте заполнение полей формы',
			type: 'error'
		})

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			description={description}
			containerClassName='w-[560px] max-w-[92vw] p-6'
			footer={
				<div className='grid w-full grid-cols-2 gap-2'>
					<Button
						view='ghost'
						width='full'
						label={cancelLabel}
						onClick={onClose}
						disabled={loading}
					/>
					<Button
						view='primary'
						width='full'
						label={confirmLabel}
						onClick={handleSubmit(onSubmitInternal, onInvalid)}
						loading={loading}
						disabled={loading}
					/>
				</div>
			}
		>
			<div className='flex flex-col gap-3'>
				<TextFieldForm<any>
					name='name'
					label='Название'
					type='text'
					placeholder='Название поля'
					control={control as any}
					autoFocus
					clearable={false}
				/>

				{showKeyAndType && (
					<>
						<TextFieldForm<any>
							name='key'
							label='Ключ (lower_snake_case)'
							placeholder='full_name'
							control={control as any}
							clearable={false}
						/>
						<Controller
							control={control as any}
							name={'fieldType' as any}
							render={({ field, fieldState }) => (
								<div
									className={`textfield-form-container ${fieldState.error ? 'has-error' : ''}`}
								>
									<label className='mb-1 block text-sm text-[var(--color-typo-secondary)]'>
										Тип поля
									</label>
									<select
										className='w-full rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-default)] p-2 text-sm text-[var(--color-typo-primary)]'
										style={{
											backgroundColor: 'var(--color-bg-default)',
											color: 'var(--color-typo-primary)'
										}}
										value={field.value as any}
										onChange={e => field.onChange(e.target.value)}
									>
										{FieldType.options.map(t => (
											<option
												key={t}
												value={t}
												style={{
													backgroundColor: 'var(--color-bg-default)',
													color: 'var(--color-typo-primary)'
												}}
											>
												{t}
											</option>
										))}
									</select>
									{fieldState.error ? (
										<div className='mt-1 text-xs text-[var(--color-typo-alert)]'>
											{fieldState.error.message}
										</div>
									) : (
										<div className='mt-1 text-xs'>&nbsp;</div>
									)}
								</div>
							)}
						/>
					</>
				)}

				<TextFieldForm<any>
					name='columnWidth'
					label='Ширина колонки (px)'
					placeholder='150'
					type='number'
					control={control as any}
				/>

				<Controller
					control={control as any}
					name={'isRequired' as any}
					render={({ field }) => (
						<Checkbox
							size='m'
							checked={Boolean(field.value)}
							onChange={field.onChange as any}
							label='Обязательное'
						/>
					)}
				/>

				<Controller
					control={control as any}
					name={'isVisible' as any}
					render={({ field }) => (
						<Checkbox
							size='m'
							checked={Boolean(field.value)}
							onChange={field.onChange as any}
							label='Видимое в таблице'
						/>
					)}
				/>

				{showSelectMeta && (
					<div className='mt-2 rounded border border-[var(--color-bg-border)] p-3'>
						<Text size='s' view='primary' weight='semibold' className='mb-2'>
							Настройки SELECT
						</Text>
						<div className='mb-2 flex gap-4'>
							<Controller
								control={control as any}
								name={'fieldMetadata.allowMultiple' as any}
								render={({ field }) => (
									<Checkbox
										size='m'
										checked={Boolean(field.value)}
										onChange={field.onChange as any}
										label='Множественный выбор'
									/>
								)}
							/>
							<Controller
								control={control as any}
								name={'fieldMetadata.disableSuggestions' as any}
								render={({ field }) => (
									<Checkbox
										size='m'
										checked={Boolean(field.value)}
										onChange={field.onChange as any}
										label='Отключить автодополнение'
									/>
								)}
							/>
						</div>

						<div>
							<Text size='s' view='secondary' className='mb-2'>
								Опции
							</Text>
							<div className='flex flex-col gap-2'>
								{optionsArray.fields.map((f, idx) => (
									<div key={(f as any).id} className='flex items-center gap-2'>
										<div className='flex-1'>
											<TextFieldForm<any>
												name={`fieldMetadata.options.${idx}.label` as any}
												label='Метка'
												placeholder='Например: Менеджер'
												control={control as any}
											/>
										</div>
										<div className='flex-1'>
											<TextFieldForm<any>
												name={`fieldMetadata.options.${idx}.value` as any}
												label='Значение'
												placeholder='manager'
												control={control as any}
											/>
										</div>
										<div className='self-center'>
											<Button
												size='s'
												view='clear'
												onlyIcon
												iconLeft={IconTrash}
												onClick={() => optionsArray.remove(idx)}
											/>
										</div>
									</div>
								))}
								<div>
									<Button
										size='s'
										view='secondary'
										label='Добавить опцию'
										onClick={() =>
											optionsArray.append({
												label: '',
												value: ''
											} as any)
										}
									/>
								</div>
								{(formState as any)?.errors?.fieldMetadata?.options?.message ? (
									<div className='mt-1 text-xs text-[var(--color-typo-alert)]'>
										{
											(formState as any)?.errors?.fieldMetadata?.options
												?.message as string
										}
									</div>
								) : null}
							</div>
						</div>
					</div>
				)}
			</div>
		</ModalShell>
	)
}

export default FieldFormModal
