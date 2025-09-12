import { zodResolver } from '@hookform/resolvers/zod'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { TextFieldForm } from '@/shared/ui/TextFieldForm'

import { useChangePasswordMutation } from '@/entities/profile'

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Введите текущий пароль'),
		newPassword: z
			.string()
			.min(8, 'Пароль должен содержать не менее 8 символов')
			.regex(/(?=.*[A-Za-z])(?=.*\d)/, 'Пароль должен содержать буквы и цифры'),
		confirmPassword: z.string().min(1, 'Подтвердите пароль')
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

type PasswordFormData = z.infer<typeof passwordSchema>

interface PasswordChangeFormProps {
	onSuccess?: () => void
	onCancel?: () => void
}

export type PasswordChangeFormHandle = {
	submitForm: () => void
}

export const PasswordChangeForm = forwardRef<
	PasswordChangeFormHandle,
	PasswordChangeFormProps
>(({ onSuccess }, ref) => {
	const changePasswordMutation = useChangePasswordMutation()

	const { control, handleSubmit, reset } = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	})

	const onSubmit = async (data: PasswordFormData) => {
		try {
			await changePasswordMutation.mutateAsync({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword
			})
			reset()
			onSuccess?.()
		} catch (error) {}
	}

	useImperativeHandle(ref, () => ({
		submitForm: handleSubmit(onSubmit)
	}))

	return (
		<form
			id='password-change-form'
			className='flex flex-col'
			onSubmit={handleSubmit(onSubmit)}
		>
			<TextFieldForm
				name='currentPassword'
				control={control}
				type='password'
				placeholder='Текущий пароль'
				label='Текущий пароль'
				size='m'
				clearable={false}
			/>
			<TextFieldForm
				name='newPassword'
				control={control}
				type='password'
				placeholder='Введите новый пароль'
				label='Новый пароль'
				size='m'
				clearable={false}
			/>
			<TextFieldForm
				name='confirmPassword'
				control={control}
				type='password'
				placeholder='Введите пароль еще раз'
				label='Повторите пароль'
				size='m'
				clearable={false}
			/>
		</form>
	)
})
