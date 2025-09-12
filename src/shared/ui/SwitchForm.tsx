import type { SwitchProps } from '@consta/uikit/Switch'
import { Switch } from '@consta/uikit/Switch'
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

interface SwitchFormProps<T extends FieldValues>
	extends Omit<SwitchProps, 'checked' | 'onChange'> {
	name: FieldPath<T>
	rules?: RegisterOptions<T, FieldPath<T>>
	defaultValue?: PathValue<T, FieldPath<T>>
	control?: Control<T>
	shouldUnregister?: boolean
}

export function SwitchForm<T extends FieldValues>({
	name,
	rules,
	defaultValue,
	control,
	shouldUnregister,
	...switchProps
}: SwitchFormProps<T>) {
	const context = useFormContext<T>()

	const renderSwitch = ({
		field,
		fieldState
	}: {
		field: ControllerRenderProps<T, FieldPath<T>>
		fieldState: ControllerFieldState
	}) => {
		const { onChange, onBlur, value, ref } = field
		return (
			<div>
				<Switch
					{...switchProps}
					checked={!!value}
					onChange={e => onChange(e.target.checked)}
					onBlur={onBlur}
					ref={ref}
				/>
				{fieldState.error && (
					<div style={{ color: 'red', fontSize: 12 }}>
						{fieldState.error.message}
					</div>
				)}
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
			render={renderSwitch}
		/>
	)
}
