import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { PUBLIC_ROUTES } from '@/shared/constants'
import { TextFieldForm } from '@/shared/ui/TextFieldForm'

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

	const navigate = useNavigate()

	return (
		<form onSubmit={handleSubmit(login)} key='login-form'>
			<div className='relative'>
				<TextFieldForm<LoginFormType>
					name='email'
					type='email'
					label='Email'
					placeholder='Введите почту'
					control={control}
					autoFocus
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
				/>
				<Link to={PUBLIC_ROUTES.FORGOT_PASSWORD}>
					<Text
						as='span'
						size='s'
						view='link'
						className='absolute top-[1%] right-0 cursor-pointer'
						style={{
							right: 0
						}}
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
				className='mb-4'
			/>
			<Button
				label='Регистрация'
				width='full'
				size='l'
				view='secondary'
				onClick={() => navigate(PUBLIC_ROUTES.REGISTER)}
			/>
		</form>
	)
}
