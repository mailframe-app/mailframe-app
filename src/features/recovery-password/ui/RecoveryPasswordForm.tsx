import { Button } from '@consta/uikit/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { PUBLIC_ROUTES } from '@/shared/constants'
import { TextFieldForm } from '@/shared/ui'

import { useRecoveryPassword } from '../model/use-recovery-password'

const RecoveryPasswordFormSchema = z
	.object({
		password: z
			.string({
				error: i =>
					i.input === undefined
						? 'Поле обязательно для заполнения'
						: 'Неверный тип'
			})
			.trim()
			.min(1, 'Поле обязательно для заполнения')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/,
				'Пожалуйста, используйте только латинские буквы, цифры и специальные символы: ! @ # $ % ^ & *'
			)
			.min(8, 'Пароль должен быть не менее 8 символов'),
		confirmPassword: z
			.string({
				error: i =>
					i.input === undefined
						? 'Поле обязательно для заполнения'
						: 'Неверный тип'
			})
			.trim()
			.min(1, 'Поле обязательно для заполнения')
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

export type RecoveryPasswordFormType = z.infer<
	typeof RecoveryPasswordFormSchema
>

export function RecoveryPasswordForm() {
	const { handleSubmit, control, formState } =
		useForm<RecoveryPasswordFormType>({
			resolver: zodResolver(RecoveryPasswordFormSchema)
		})

	const { recoveryPassword, isPending } = useRecoveryPassword()
	const navigate = useNavigate()
	return (
		<form
			onSubmit={handleSubmit(data => recoveryPassword(data))}
			className='w-full'
		>
			<TextFieldForm<RecoveryPasswordFormType>
				name='password'
				type='password'
				label='Пароль'
				size='l'
				placeholder='Введите пароль'
				control={control}
				autoFocus
				clearable={false}
			/>
			<TextFieldForm<RecoveryPasswordFormType>
				name='confirmPassword'
				type='password'
				label='Повторите пароль'
				size='l'
				placeholder='Повторите пароль'
				control={control}
				clearable={false}
			/>

			<Button
				type='submit'
				size='m'
				width='full'
				// disabled={!formState.isValid}
				view={formState.isValid ? 'primary' : 'ghost'}
				label='Продолжить'
				loading={isPending}
				className='mb-4'
			/>
			<Button
				label='Назад'
				width='full'
				size='m'
				view='clear'
				className='!border !border-[var(--color-control-bg-border-default)]'
				onClick={() => navigate(PUBLIC_ROUTES.LOGIN)}
			/>
		</form>
	)
}
