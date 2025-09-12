import { IconAdd } from '@consta/icons/IconAdd'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Select } from '@consta/uikit/Select'
import { Switch } from '@consta/uikit/Switch'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import * as React from 'react'
import { useMemo } from 'react'

import { getContactFields } from '@/features/VariablesTab/api/api'
import type { IDbField, IVariableItem, TVariableMapping } from '@/features/VariablesTab/model/types'
import { useVariablesStore } from '@/features/VariablesTab/model/useVariablesStore'
import {
	getDuplicateTokens,
	isValidToken,
	normalizeTokenInput
} from '@/features/VariablesTab/model/utils'

import { cn } from '@/shared/lib'

export interface IVarsTabProps {
	dbFields?: IDbField[]
	value?: IVariableItem[]
	onChange?: (items: IVariableItem[]) => void
	onMappingChange?: (mapping: TVariableMapping) => void
	autoLoadFromApi?: boolean
	isWide?: boolean
}

const DEFAULT_DB_FIELDS: IDbField[] = [
	{ label: 'ФИО', value: 'fullName' },
	{ label: 'Email', value: 'email' },
	{ label: 'Компания', value: 'company' },
	{ label: 'Должность', value: 'position' }
]

export const VariablesTab: React.FC<IVarsTabProps> = ({
	dbFields,
	isWide,
	value,
	onChange,
	onMappingChange,
	autoLoadFromApi = true
}) => {
	const items = useVariablesStore(s => s.items)
	const setAll = useVariablesStore(s => s.setAll)
	const add = useVariablesStore(s => s.add)
	const update = useVariablesStore(s => s.update)
	const remove = useVariablesStore(s => s.remove)

	const mapping = useMemo((): TVariableMapping => {
		const newMapping: TVariableMapping = {}
		items.forEach(i => {
			if (i.token && isValidToken(i.token) && i.field?.value) {
				newMapping[i.token] = {
					fieldKey: i.field.value,
					default: i.defaultValue || '',
					required: !!i.required
				}
			}
		})
		return newMapping
	}, [items])

	const [availableFields, setAvailableFields] = React.useState<IDbField[]>(
		dbFields?.length ? dbFields : DEFAULT_DB_FIELDS
	)
	const [loadingFields, setLoadingFields] = React.useState(false)
	const [fieldsError, setFieldsError] = React.useState<string | null>(null)

	/** Инициализация стора из пропсов value — один раз, если пусто */
	const initRef = React.useRef(false)
	React.useEffect(() => {
		if (initRef.current) return
		initRef.current = true
		if (items.length === 0 && value?.length) {
			setAll(value)
		} else if (items.length === 0) {
			add()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	React.useEffect(() => {
		onChange?.(items)
		onMappingChange?.(mapping)
	}, [items, mapping, onChange, onMappingChange])

	React.useEffect(() => {
		let ignore = false
		const needFetch = (!dbFields || dbFields.length === 0) && autoLoadFromApi
		if (!needFetch) return

		const load = async () => {
			setLoadingFields(true)
			setFieldsError(null)
			try {
				const fields = await getContactFields()
				const mapped: IDbField[] = fields
					.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
					.map(f => ({ label: String(f.name ?? f.key ?? ''), value: String(f.key ?? '') }))
					.filter(f => f.value)

				if (!ignore) setAvailableFields(mapped.length ? mapped : DEFAULT_DB_FIELDS)
			} catch (error) {
				console.error('[VariablesTab] getContactFields failed:', error)
				if (!ignore) {
					setFieldsError('Не удалось загрузить поля. Будут использованы дефолтные.')
					setAvailableFields(DEFAULT_DB_FIELDS)
				}
			} finally {
				if (!ignore) setLoadingFields(false)
			}
		}
		load()
		return () => {
			ignore = true
		}
	}, [dbFields, autoLoadFromApi])

	const addRow = () => add()
	const removeRow = (id: string) => remove(id)
	const updateToken = (id: string, next: string) => update(id, { token: next })
	const commitToken = (id: string, current: string) =>
		update(id, { token: normalizeTokenInput(current) })
	const updateField = (id: string, next: IDbField | null | undefined) =>
		update(id, { field: next ?? null })
	const updateDefault = (id: string, val: string) => update(id, { defaultValue: val })
	const updateRequired = (id: string, val: boolean) => update(id, { required: val })

	const duplicates = getDuplicateTokens(items)

	return (
		<div className='flex h-full flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<Text size='s' weight='light' className='mb-1 text-gray-500'>
					Создать переменную
				</Text>
				<Button label='' iconLeft={IconAdd} view='primary' size='s' onClick={addRow} />
			</div>

			{fieldsError && (
				<Text as='p' size='s' className='text-red-500'>
					{fieldsError}
				</Text>
			)}

			<div className='flex flex-col gap-3'>
				{items.map(item => {
					const normalized = normalizeTokenInput(item.token || '')
					const looksWrapped = /^\{\{.*\}\}$/.test(item.token || '')
					const validToken = isValidToken(item.token || '')
					const isDuplicate = !!item.token && duplicates.has(item.token.trim())

					return (
						<Card key={item.id} shadow={false} border className='!rounded-lg p-3'>
							<div className='flex flex-col gap-3'>
								{/* Блок с полями ввода */}
								<div className={cn('flex flex-col gap-3', isWide && 'md:flex-row')}>
									{/* Поле "Переменная" */}
									<div className='flex-1'>
										<Text size='s' view='ghost' className='mb-1'>
											Переменная (в тексте)
										</Text>
										<TextField
											size='s'
											view='default'
											value={item.token}
											placeholder='{{userName}}'
											onChange={v => updateToken(item.id, v || '')}
											onBlur={() => commitToken(item.id, item.token)}
											className={`w-full ${!validToken || isDuplicate ? 'border-red-400' : ''}`}
										/>
										<div className='mt-1'>
											{!validToken && item.token && (
												<Text as='p' size='xs' className='text-red-500'>
													Неверный формат. Разрешены латиница/цифры/нижнее подчёркивание. Пример:{' '}
													{'{{order_number}}'}.
												</Text>
											)}
											{isDuplicate && (
												<Text as='p' size='xs' className='text-red-500'>
													Дублирующийся токен — сделайте имя уникальным.
												</Text>
											)}
											{!!item.token && !looksWrapped && (
												<Text as='p' size='xs' className='text-gray-400'>
													Будет применено как <b>{normalized}</b>
												</Text>
											)}
										</div>
									</div>

									{/* Поле "Поле из базы" */}
									<div className='flex-1'>
										<Text size='s' view='ghost' className='mb-1'>
											Поле из базы
										</Text>
										<Select<IDbField>
											size='s'
											items={availableFields}
											value={item.field ?? undefined}
											onChange={val => updateField(item.id, val ?? null)}
											disabled={loadingFields}
											getItemKey={i => i.value}
											getItemLabel={i => i.label}
											placeholder={loadingFields ? 'Загрузка…' : 'Выберите поле'}
											className='w-full'
										/>

										<div className='mt-3'>
											<Text size='s' view='ghost' className='mb-1'>
												Значение по умолчанию (default)
											</Text>
											<TextField
												size='s'
												view='default'
												value={item.defaultValue ?? ''}
												onChange={v => updateDefault(item.id, v ?? '')}
												placeholder='Напр.: Уважаемый клиент'
												className='w-full'
											/>
										</div>
									</div>
								</div>

								{/* Блок с переключателем и кнопкой */}
								<div className='flex items-center justify-between border-t border-gray-100 pt-3'>
									<div>
										<Switch
											size='s'
											checked={!!item.required}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												updateRequired(item.id, e.target.checked)
											}
											label='Обязательная'
										/>
									</div>
									<div className='md:pt-6'>
										<Button
											view='clear'
											onlyIcon
											iconLeft={IconTrash}
											size='s'
											disabled={items.length <= 1}
											onClick={() => removeRow(item.id)}
											title='Удалить переменную'
										/>
									</div>
								</div>
							</div>
						</Card>
					)
				})}
			</div>

			<div className='mt-1 space-y-4'>
				{/* Основные правила */}
				<ol className='list-decimal space-y-2 pl-5 text-[14px] text-gray-500'>
					<li>
						<Text as='p' size='s' view='secondary' className='leading-relaxed'>
							Укажите переменные в фигурных скобках <code>{'{{…}}'}</code>.
						</Text>
					</li>
					<li>
						<Text as='p' size='s' view='secondary' className='leading-relaxed'>
							Назовите переменную (например: <code>{'{{userName}}'}</code>).
						</Text>
					</li>
					<li>
						<Text as='p' size='s' view='secondary' className='leading-relaxed'>
							При отправке письма система автоматически подставит данные из базы.
						</Text>
					</li>
					<li>
						<Text as='p' size='s' view='secondary' className='leading-relaxed'>
							Если данных нет, будет использован текст по умолчанию (например: «Уважаемый клиент»).
						</Text>
					</li>
				</ol>

				<Text as='p' size='s' view='secondary' weight='bold' className='mt-1'>
					Примеры:
				</Text>

				<ol className='list-decimal space-y-2 pl-5 text-[14px] text-gray-500'>
					<li>
						<Text as='p' size='s' view='secondary' className='leading-relaxed'>
							Здравствуйте, <code>{'{{userName}}'}</code>! <span className='mx-1'>→</span>
							<span className='italic'>«Здравствуйте, Иван!»</span>
						</Text>
					</li>
					<li>
						<Text as='p' size='s' view='secondary' className='leading-relaxed'>
							Ваш заказ № <code>{'{{order_number}}'}</code> готов <span className='mx-1'>→</span>
							<span className='italic'>«ваш заказ № 12345 готов»</span>
						</Text>
					</li>
					<li>
						<Text as='p' size='s' view='secondary' className='leading-relaxed'>
							Добро пожаловать в <code>{'{{city}}'}</code> <span className='mx-1'>→</span>
							<span className='italic'>«Добро пожаловать в Москву»</span>
						</Text>
					</li>
				</ol>

				{/* Обновлённая часть про отписку */}
				<Text as='p' size='s' view='secondary' className='leading-relaxed'>
					<b>Обратите внимание:</b> для ссылки на отписку в шаблон вставьте текст, включите для него
					«ссылку» и в поле URL укажите <code>{'{{unsubscribe_url}}'}</code>.
				</Text>
			</div>
		</div>
	)
}
