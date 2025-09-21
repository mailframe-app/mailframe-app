import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { PUBLIC_ROUTES } from '@/shared/constants'
import { TextFieldForm } from '@/shared/ui'

import { useAuth } from '../model/auth-context'

const LoginFormSchema = z.object({
	email: z
		.string({
			error: i =>
				i.input === undefined
					? 'Введите адрес электронной почты'
					: 'Неверный тип'
		})
		.trim()
		.min(1, { message: 'Введите адрес электронной почты' })
		.refine(v => z.email().safeParse(v).success, {
			message: 'Введите корректный адрес электронной почты'
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
		.max(128, { message: 'Пароль должен содержать не более 128 символов' })
})

export type LoginFormType = z.infer<typeof LoginFormSchema>

export function LoginForm() {
	const { login, isLoginPending } = useAuth()

	const { handleSubmit, control, formState } = useForm<LoginFormType>({
		resolver: zodResolver(LoginFormSchema)
	})

	return (
		<form onSubmit={handleSubmit(login)} key='login-form' className='w-full'>
			<div className='relative'>
				<TextFieldForm<LoginFormType>
					name='email'
					type='email'
					label='Email'
					placeholder='Введите почту'
					control={control}
					autoFocus
					size='l'
				/>
			</div>
			<div className='relative'>
				<TextFieldForm<LoginFormType>
					name='password'
					type='password'
					label='Пароль'
					placeholder='Введите пароль'
					control={control}
					clearable={false}
					size='l'
				/>
				<Link to={PUBLIC_ROUTES.FORGOT_PASSWORD}>
					<Text
						view='secondary'
						size='s'
						className='absolute right-0 -bottom-1 cursor-pointer underline'
					>
						Забыли пароль?
					</Text>
				</Link>
			</div>
			<Button
				type='submit'
				size='l'
				width='full'
				// disabled={!formState.isValid}
				view={formState.isValid ? 'primary' : 'ghost'}
				label='Войти'
				loading={isLoginPending}
				className='mt-8'
			/>
		</form>
	)
}
