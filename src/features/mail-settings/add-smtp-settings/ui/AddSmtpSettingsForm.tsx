import { Text } from '@consta/uikit/Text'
import { zodResolver } from '@hookform/resolvers/zod'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { SwitchForm, TextFieldForm } from '@/shared/ui'

import type { SmtpSettingsDto } from '@/entities/mail-settings'

export const SmtpFormSchema = z.object({
	smtpHost: z
		.string()
		.min(1, { message: 'Адрес сервера SMTP не может быть пустым' }),
	smtpPort: z.coerce.number().int().min(1).max(65535),
	smtpSecure: z.boolean(),
	smtpUser: z
		.string()
		.min(1, { message: 'Имя пользователя не может быть пустым' }),
	smtpPassword: z.string().optional(),
	smtpFromEmail: z
		.string({
			error: i =>
				i.input === undefined ? 'Введите корректный email' : 'Неверный тип'
		})
		.trim()
		.min(1, { message: 'Введите корректный email' })
		.refine(v => z.email().safeParse(v).success, {
			message: 'Введите корректный email'
		}),
	smtpFromName: z
		.string()
		.min(1, { message: 'Имя отправителя не может быть пустым' }),
	isDefault: z.boolean()
})

export type SmtpFormType = z.input<typeof SmtpFormSchema>

interface AddSmtpSettingsFormProps {
	onSuccess?: () => void
	createSmtpSettings: (settings: SmtpSettingsDto) => Promise<any>
}

export type AddSmtpSettingsFormHandle = {
	submitForm: () => void
	getValues: () => SmtpFormType
}

export const AddSmtpSettingsForm = forwardRef<
	AddSmtpSettingsFormHandle,
	AddSmtpSettingsFormProps
>(({ onSuccess, createSmtpSettings }, ref) => {
	const form = useForm<SmtpFormType>({
		resolver: zodResolver(SmtpFormSchema),
		defaultValues: {
			smtpHost: '',
			smtpPort: 465,
			smtpSecure: true,
			smtpUser: '',
			smtpPassword: '',
			smtpFromEmail: '',
			smtpFromName: '',
			isDefault: false
		}
	})

	const { handleSubmit, control, getValues } = form

	const onSubmit = async (data: SmtpFormType) => {
		const { smtpPort, ...rest } = data
		const parsedPort =
			typeof smtpPort === 'string' ? parseInt(smtpPort, 10) : smtpPort

		if (typeof parsedPort === 'number' && !isNaN(parsedPort)) {
			await createSmtpSettings({ ...rest, smtpPort: parsedPort })
			onSuccess?.()
		}
	}

	useImperativeHandle(ref, () => ({
		submitForm: handleSubmit(onSubmit),
		getValues
	}))

	return (
		<form
			id='add-smtp-settings-form'
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col gap-4 pt-4'
		>
			<Text size='m' weight='semibold' view='primary'>
				Настройка почтового клиента
			</Text>

			<div className='grid grid-cols-12 gap-x-4'>
				{/* SMTP хост, порт и безопасное соединение в одной строке */}
				<div className='col-span-6 items-center'>
					<Text view='secondary' size='s' className='mb-2'>
						Хост SMTP
					</Text>
					<TextFieldForm<SmtpFormType>
						name='smtpHost'
						placeholder='smtp@example.ru'
						control={control}
						label=''
						clearable={false}
					/>
				</div>
				<div className='col-span-2'>
					<Text view='secondary' size='s' className='mb-2'>
						Порт SMTP
					</Text>
					<TextFieldForm<SmtpFormType>
						name='smtpPort'
						control={control}
						label=''
						type='number'
						clearable={false}
					/>
				</div>
				<div className='col-span-4 mt-3 flex items-center'>
					<SwitchForm<SmtpFormType>
						name='smtpSecure'
						label='Безопасное соединение (TLS/SSL)'
						control={control}
					/>
				</div>

				{/* Пользователь и пароль SMTP в одной строке */}
				<div className='col-span-6'>
					<Text view='secondary' size='s' className='mb-2'>
						Пользователь SMTP
					</Text>
					<TextFieldForm<SmtpFormType>
						name='smtpUser'
						placeholder='user@example.ru'
						control={control}
						label=''
						clearable={false}
					/>
				</div>
				<div className='col-span-6'>
					<Text view='secondary' size='s' className='mb-2'>
						Пароль SMTP
					</Text>
					<TextFieldForm<SmtpFormType>
						name='smtpPassword'
						type='password'
						placeholder='••••••••'
						control={control}
						clearable={false}
						label=''
					/>
				</div>

				{/* Отправитель */}
				<div className='col-span-12 mt-2'>
					<Text size='m' weight='semibold' view='primary'>
						Отправитель
					</Text>
				</div>

				{/* Email отправителя и имя отправителя в одной строке */}
				<div className='col-span-6'>
					<Text view='secondary' size='s' className='mb-2'>
						Email отправителя
					</Text>
					<TextFieldForm<SmtpFormType>
						name='smtpFromEmail'
						placeholder='user@example.ru'
						control={control}
						label=''
						clearable={false}
					/>
				</div>
				<div className='col-span-6'>
					<Text view='secondary' size='s' className='mb-2'>
						Имя отправителя
					</Text>
					<TextFieldForm<SmtpFormType>
						name='smtpFromName'
						placeholder='Отдел коммуникаций'
						control={control}
						label=''
						clearable={false}
					/>
				</div>

				{/* Использовать по умолчанию */}
				<div className='col-span-12 mt-2'>
					<SwitchForm<SmtpFormType>
						name='isDefault'
						label='Использовать по умолчанию'
						control={control}
					/>
				</div>
			</div>
		</form>
	)
})
