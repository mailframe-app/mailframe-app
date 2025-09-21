import type {
	TextFieldPropOnChange,
	TextFieldProps
} from '@consta/uikit/TextField'
import { TextField } from '@consta/uikit/TextField'
import type {
	Control,
	ControllerFieldState,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	PathValue,
	RegisterOptions
} from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'

interface TextFieldFormProps<T extends FieldValues>
	extends Omit<TextFieldProps<string>, 'onChange' | 'value'> {
	name: FieldPath<T>
	rules?: RegisterOptions<T, FieldPath<T>>
	defaultValue?: PathValue<T, FieldPath<T>>
	control?: Control<T>
	shouldUnregister?: boolean
	clearable?: boolean
}

export function TextFieldForm<T extends FieldValues>({
	name,
	rules,
	defaultValue,
	control,
	shouldUnregister,
	form,
	clearable = true,
	...textFieldProps
}: TextFieldFormProps<T>) {
	const context = useFormContext<T>()

	const renderTextField = ({
		field,
		fieldState
	}: {
		field: ControllerRenderProps<T, FieldPath<T>>
		fieldState: ControllerFieldState
	}) => {
		const { onChange, onBlur, value, ref } = field
		const handleChange: TextFieldPropOnChange = v => {
			onChange(v ?? '')
		}
		return (
			<div
				className={`textfield-form-container ${fieldState.error ? 'has-error' : ''}`}
			>
				<TextField
					{...textFieldProps}
					onChange={handleChange}
					onBlur={onBlur}
					onClear={clearable ? () => field.onChange('') : undefined}
					className={`custom-textfield ${clearable ? 'custom-clear-icon' : ''}`}
					withClearButton={clearable}
					form={form}
					value={value ?? ''}
					ref={ref}
					status={fieldState.error ? 'alert' : undefined}
					caption={fieldState.error ? fieldState.error.message : '\u00A0'}
				/>
			</div>
		)
	}

	return (
		<Controller
			name={name}
			rules={rules}
			defaultValue={defaultValue}
			control={control || context.control}
			shouldUnregister={shouldUnregister}
			render={renderTextField}
		/>
	)
}
