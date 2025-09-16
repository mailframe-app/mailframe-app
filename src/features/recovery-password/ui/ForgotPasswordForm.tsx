import { Button } from '@consta/uikit/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { TextFieldForm } from '@/shared/ui/TextFieldForm'

import type { SendPasswordRecoveryRequest } from '../api'

const ForgotPasswordFormSchema = z.object({
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
			message: 'Неверный формат электронной почты'
		})
})

type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>

interface ForgotPasswordFormProps {
	onSubmit: (data: SendPasswordRecoveryRequest) => Promise<void> | void
	isPending: boolean
}

export function ForgotPasswordForm({
	onSubmit,
	isPending
}: ForgotPasswordFormProps) {
	const { handleSubmit, control, formState } = useForm<ForgotPasswordFormType>({
		resolver: zodResolver(ForgotPasswordFormSchema)
	})
	const navigate = useNavigate()
	const handleFormSubmit = (data: ForgotPasswordFormType) => {
		onSubmit(data)
	}

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className='w-full'>
			<TextFieldForm<ForgotPasswordFormType>
				name='email'
				type='email'
				label='Email'
				size='l'
				placeholder='Введите почту'
				control={control}
				autoFocus
			/>

			<Button
				type='submit'
				size='m'
				width='full'
				// disabled={!formState.isValid}
				view={formState.isValid ? 'primary' : 'ghost'}
				label='Отправить'
				loading={isPending}
				className='mb-4'
			/>
			<Button
				label='Назад'
				width='full'
				size='m'
				view='clear'
				className='!border !border-[var(--color-control-bg-border-default)]'
				onClick={() => navigate(-1)}
			/>
		</form>
	)
}
