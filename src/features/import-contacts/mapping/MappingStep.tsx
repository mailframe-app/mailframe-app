import { Select } from '@consta/uikit/Select'
import { Switch } from '@consta/uikit/Switch'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'

import type { MappingOptionsState, MappingState } from '../ui/ImportWizard'

import type {
	ContactFieldDefinitionDto,
	ContactFieldType
} from '@/entities/contacts/api/types'

type Props = {
	headers: string[]
	fields: ContactFieldDefinitionDto[]
	mapping: MappingState
	onChange: (m: MappingState) => void
	options: MappingOptionsState
	onOptionsChange: (o: MappingOptionsState) => void
	createNewFields: boolean
	onToggleCreateNewFields: (v: boolean) => void
}

type Option = { label: string; value: string }

const toOptions = (fields: ContactFieldDefinitionDto[]): Option[] =>
	fields.map(f => ({ label: `${f.name} (${f.key})`, value: f.key }))

const UPDATE_STRATEGY_LABELS: Record<
	MappingOptionsState['updateStrategy'],
	string
> = {
	insert: 'Только добавлять новые контакты',
	update_mapped: 'Обновлять поля у существующих контактов',
	replace_mapped: 'Заменять поля у существующих контактов'
}

const VALUE_MERGE_LABELS: Record<MappingOptionsState['valueMerge'], string> = {
	last_wins: 'Использовать значение из последнего столбца',
	first_wins: 'Использовать значение из первого столбца'
}

const updateStrategyItems = Object.entries(UPDATE_STRATEGY_LABELS).map(
	([value, label]) => ({
		label,
		value: value as MappingOptionsState['updateStrategy']
	})
)
const valueMergeItems = Object.entries(VALUE_MERGE_LABELS).map(
	([value, label]) => ({
		label,
		value: value as MappingOptionsState['valueMerge']
	})
)

const fieldTypeItems: Option[] = [
	{ label: 'Текст', value: 'TEXT' },
	{ label: 'Email', value: 'EMAIL' },
	{
		label: 'Телефон',
		value: 'PHONE'
	},
	{
		label: 'Число',
		value: 'NUMBER'
	},
	{ label: 'Дата', value: 'DATE' },
	{
		label: 'Текстовое поле',
		value: 'TEXTAREA'
	},
	{ label: 'Ссылка', value: 'URL' },
	{
		label: 'Выбор',
		value: 'SELECT'
	}
]

function MappingStep({
	headers,
	fields,
	mapping,
	onChange,
	options,
	onOptionsChange,
	createNewFields,
	onToggleCreateNewFields
}: Props) {
	const fieldOptions = toOptions(fields)
	const selectedKeys = new Set(
		Object.values(mapping)
			.map(m => m.fieldKey)
			.filter(Boolean)
	)

	return (
		<div className='flex flex-col gap-4'>
			<Text size='l' weight='bold' className='mb-4' view='primary'>
				Сопоставление полей
			</Text>
			<div className='flex flex-col gap-4'>
				{headers.map(h => {
					const item = mapping[h]
					const create = Boolean(item?.createNewField)
					const value = item?.fieldKey
						? (fieldOptions.find(o => o.value === item.fieldKey) ?? null)
						: null
					return (
						<div
							key={h}
							className='grid grid-cols-1 gap-2 md:grid-cols-2 md:items-start'
						>
							<Text size='s' view='secondary'>
								{h}
							</Text>

							<div>
								<div className='flex items-center gap-2'>
									<Select<Option>
										className='flex-1'
										placeholder='Выберите поле из таблицы контактов'
										value={value}
										items={fieldOptions}
										getItemKey={i => i.value}
										getItemLabel={i => i.label}
										onChange={v => {
											const next = { ...mapping }
											next[h] = {
												...next[h],
												fieldKey: v?.value || ''
											}
											onChange(next)
										}}
									/>
									<Switch
										label='Создать'
										checked={create}
										onChange={e => {
											const checked = (e.target as any).checked
											const next = { ...mapping }
											if (checked) {
												const key = next[h]?.createNewField?.key || ''
												next[h] = {
													...next[h],
													fieldKey: key,
													createNewField: {
														key: key,
														name: '',
														fieldType: 'TEXT'
													}
												}
											} else {
												delete next[h]?.createNewField
											}
											onChange(next)
										}}
									/>
								</div>
								{item?.fieldKey &&
									Array.from(selectedKeys).filter(k => k === item.fieldKey)
										.length > 1 && (
										<Text size='xs' view='alert' className='mt-1'>
											Поле уже выбрано
										</Text>
									)}

								{create && (
									<div className='mt-2 grid grid-cols-1 gap-2 md:grid-cols-3'>
										<TextField
											size='s'
											placeholder='Ключ'
											value={item?.createNewField?.key || ''}
											onChange={value => {
												const next = { ...mapping }
												if (!next[h].createNewField) return
												const newKey = value || ''
												next[h].fieldKey = newKey // Синхронизируем
												next[h].createNewField!.key = newKey
												onChange(next)
											}}
										/>
										<TextField
											size='s'
											placeholder='Название'
											value={item?.createNewField?.name || ''}
											onChange={value => {
												const next = { ...mapping }
												if (!next[h].createNewField) return
												next[h].createNewField!.name = value || ''
												onChange(next)
											}}
										/>
										<Select<Option>
											size='s'
											placeholder='Тип'
											value={
												fieldTypeItems.find(
													i =>
														i.value ===
														(item?.createNewField?.fieldType || 'TEXT')
												) || null
											}
											items={fieldTypeItems}
											getItemKey={i => i.value}
											getItemLabel={i => i.label}
											onChange={v => {
												const next = { ...mapping }
												if (!next[h].createNewField) return
												next[h].createNewField!.fieldType =
													v?.value as ContactFieldType
												onChange(next)
											}}
										/>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
			<div
				className='mt-4 border-t pt-4'
				style={{
					borderColor: 'var(--color-bg-border)'
				}}
			>
				<Text size='l' weight='bold' className='mb-4' view='primary'>
					Опции импорта
				</Text>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<div
						className='rounded border p-3'
						style={{
							borderColor: 'var(--color-bg-border)'
						}}
					>
						<Text view='secondary' size='s' className='mb-2'>
							Стратегия обновления
						</Text>
						<Select
							value={updateStrategyItems.find(
								i => i.value === options.updateStrategy
							)}
							items={updateStrategyItems}
							getItemLabel={item => item.label}
							getItemKey={item => item.value}
							onChange={v =>
								onOptionsChange({
									...options,
									updateStrategy: v?.value as any
								})
							}
						/>
					</div>
					<div
						className='rounded border p-3'
						style={{
							borderColor: 'var(--color-bg-border)'
						}}
					>
						<Text view='secondary' size='s' className='mb-2'>
							Действие при совпадении значений выбранных полей
						</Text>
						<Select
							value={valueMergeItems.find(i => i.value === options.valueMerge)}
							items={valueMergeItems}
							getItemLabel={item => item.label}
							getItemKey={item => item.value}
							onChange={v =>
								onOptionsChange({
									...options,
									valueMerge: v?.value as any
								})
							}
						/>
					</div>
				</div>
				<div
					className='mt-4 flex flex-col gap-2 rounded border p-3'
					style={{
						borderColor: 'var(--color-bg-border)'
					}}
				>
					<Switch
						checked={options.restoreSoftDeleted}
						onChange={e =>
							onOptionsChange({
								...options,
								restoreSoftDeleted: (e.target as any).checked
							})
						}
						label='Восстанавливать удалённые контакты'
					/>
					<Switch
						checked={options.ignoreEmptyValues}
						onChange={e =>
							onOptionsChange({
								...options,
								ignoreEmptyValues: (e.target as any).checked
							})
						}
						label='Игнорировать пустые значения в файле импорта'
					/>
					<Switch
						checked={createNewFields}
						onChange={e => {
							onToggleCreateNewFields((e.target as any).checked)
						}}
						label='Создавать недостающие поля автоматически'
					/>
				</div>
			</div>
		</div>
	)
}

export default MappingStep
