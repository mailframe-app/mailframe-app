import { Button } from '@consta/uikit/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { TextFieldForm } from '@/shared/ui'

import { useRegister } from '../model/use-register'

const RegisterFormSchema = z
	.object({
		email: z
			.string({
				error: i =>
					i.input === undefined
						? 'Поле обязательно для заполнения'
						: 'Неверный тип'
			})
			.trim()
			.min(1, { message: 'Поле обязательно для заполнения' })
			.refine(v => z.email().safeParse(v).success, {
				message: 'Email введен неправильно'
			}),
		password: z
			.string({
				error: i =>
					i.input === undefined
						? 'Поле обязательно для заполнения'
						: 'Неверный тип'
			})
			.trim()
			.min(1, { message: 'Поле обязательно для заполнения' })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/,
				'Пожалуйста, используйте только латинские буквы, цифры и специальные символы: ! @ # $ % ^ & *'
			),
		confirmPassword: z
			.string({
				error: i =>
					i.input === undefined
						? 'Поле обязательно для заполнения'
						: 'Неверный тип'
			})
			.trim()
			.min(1, { message: 'Поле обязательно для заполнения' }),
		name: z
			.string({
				error: i =>
					i.input === undefined
						? 'Поле обязательно для заполнения'
						: 'Неверный тип'
			})
			.trim()
			.min(1, { message: 'Поле обязательно для заполнения' })
			.regex(
				/^[a-zA-Zа-яА-ЯёЁ0-9\s\-'\.()]+$/,
				'Поле может содержать только буквы русского или латинского алфавитов, цифры, дефис, пробел, апостроф, точку, круглые скобки'
			)
	})
	.refine(data => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Пароли не совпадают'
	})

export type RegisterFormType = z.infer<typeof RegisterFormSchema>

export function RegisterForm() {
	const { handleSubmit, control, formState } = useForm<RegisterFormType>({
		resolver: zodResolver(RegisterFormSchema)
	})
	const { register, isRegisterPending } = useRegister()
	const onSubmit = (data: RegisterFormType) => {
		register(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='w-full'>
			<TextFieldForm<RegisterFormType>
				name='name'
				type='text'
				label='ФИО'
				placeholder='Введите имя'
				control={control}
				autoFocus
				size='l'
			/>
			<TextFieldForm<RegisterFormType>
				name='email'
				type='email'
				label='Email'
				placeholder='Введите почту'
				control={control}
				size='l'
			/>

			<TextFieldForm<RegisterFormType>
				name='password'
				type='password'
				label='Пароль'
				placeholder='Введите пароль'
				control={control}
				clearable={false}
				size='l'
			/>
			<TextFieldForm<RegisterFormType>
				name='confirmPassword'
				type='password'
				label='Повторите пароль'
				placeholder='Повторите пароль'
				control={control}
				clearable={false}
				size='l'
			/>

			<Button
				type='submit'
				size='l'
				width='full'
				// disabled={!formState.isValid}
				view={formState.isValid ? 'primary' : 'ghost'}
				label='Зарегистрироваться'
				loading={isRegisterPending}
				className='mt-4'
			/>
		</form>
	)
}
