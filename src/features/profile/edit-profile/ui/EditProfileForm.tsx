import { IconAllDone } from '@consta/icons/IconAllDone'
import { IconClear } from '@consta/icons/IconClear'
import { Badge } from '@consta/uikit/Badge'
import { DatePicker } from '@consta/uikit/DatePicker'
import { Text } from '@consta/uikit/Text'
import { Controller, useForm } from 'react-hook-form'

import { useTheme } from '@/features/theme'

import { TextFieldForm } from '@/shared/ui'

import { ProfileFormHeader } from './ProfileFormHeader'
import { TimezoneSelect, timezoneItems } from './TimezoneSelect'
import {
	type ProfileResponse,
	useUpdateProfileInfoMutation
} from '@/entities/profile'

interface EditProfileFormProps {
	profile: ProfileResponse | undefined
}

export const EditProfileForm = ({ profile }: EditProfileFormProps) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty }
	} = useForm({
		defaultValues: {
			displayName: profile?.displayName || '',
			email: profile?.email || '',
			city: profile?.city || '',
			organization: profile?.organization || '',
			birthDate: profile?.birthDate || '',
			timezone: profile?.timezone
				? timezoneItems.find(tz => tz.value === profile.timezone)
				: undefined
		}
	})

	const { theme } = useTheme()

	const updateProfileMutation = useUpdateProfileInfoMutation()

	const onSubmit = (data: any) => {
		const payload = {
			...data,
			timezone: data.timezone?.value
		}

		// Фильтруем пустые значения
		const filteredPayload = Object.fromEntries(
			Object.entries(payload).filter(
				([, value]) => value !== '' && value !== null && value !== undefined
			)
		)

		if (Object.keys(filteredPayload).length === 0) {
			return
		}

		updateProfileMutation.mutate(filteredPayload, {
			onSuccess: () => {
				reset(data)
			}
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
			<ProfileFormHeader
				isDirty={isDirty}
				isLoading={updateProfileMutation.isPending}
				onSave={handleSubmit(onSubmit)}
				onRevert={() => reset()}
			/>
			<div>
				<div className='grid grid-cols-2 gap-x-4'>
					{/* ФИО */}
					<div className='col-span-2'>
						<TextFieldForm
							name='displayName'
							control={control}
							label='Фамилия и имя'
							clearable={false}
							className='textfield-no-border'
							style={
								{
									'--color-control-bg-default':
										theme === 'presetGpnDefault'
											? '#F8FAFC'
											: 'var(--color-bg-stripe)'
								} as React.CSSProperties
							}
						/>
					</div>
					{/* Email */}
					<div className='relative col-span-2'>
						<TextFieldForm
							name='email'
							control={control}
							label='Почта'
							readOnly
							clearable={false}
							className='textfield-no-border'
							style={
								{
									'--color-control-bg-default':
										theme === 'presetGpnDefault'
											? '#F8FAFC'
											: 'var(--color-bg-stripe)'
								} as React.CSSProperties
							}
						/>
						{profile?.isEmailVerified ? (
							<div className='absolute top-[36px] right-3'>
								<Badge
									label='ПОДТВЕРЖДЕНА'
									status='success'
									view='tinted'
									iconLeft={IconAllDone}
								/>
							</div>
						) : (
							<div className='absolute top-[36px] right-3'>
								<Badge
									label='НЕ ПОДТВЕРЖДЕНА'
									status='error'
									view='tinted'
									iconLeft={IconClear}
								/>
							</div>
						)}
					</div>
					{/* Город */}
					<TextFieldForm
						name='city'
						control={control}
						label='Город'
						placeholder='Введите город'
						clearable={false}
						className='textfield-no-border'
						style={
							{
								'--color-control-bg-default':
									theme === 'presetGpnDefault'
										? '#F8FAFC'
										: 'var(--color-bg-stripe)'
							} as React.CSSProperties
						}
					/>
					{/* Часовой пояс */}
					<Controller
						name='timezone'
						control={control}
						render={({ field }) => (
							<div>
								<Text
									view='primary'
									size='s'
									weight='medium'
									className='mb-2 block'
								>
									Часовой пояс
								</Text>
								<TimezoneSelect value={field.value} onChange={field.onChange} />
							</div>
						)}
					/>
					{/* Отдел */}
					<TextFieldForm
						name='organization'
						control={control}
						label='Отдел'
						placeholder='Введите отдел'
						clearable={false}
						className='textfield-no-border'
						style={
							{
								'--color-control-bg-default':
									theme === 'presetGpnDefault'
										? '#F8FAFC'
										: 'var(--color-bg-stripe)'
							} as React.CSSProperties
						}
					/>
					{/* Дата рождения */}
					<Controller
						name='birthDate'
						control={control}
						render={({ field }) => (
							<div>
								<Text
									view='primary'
									size='s'
									weight='medium'
									className='mb-2 block'
								>
									Дата рождения
								</Text>
								<DatePicker
									className='textfield-no-border w-full'
									style={
										{
											'--color-control-bg-default':
												theme === 'presetGpnDefault'
													? '#F8FAFC'
													: 'var(--color-bg-stripe)'
										} as React.CSSProperties
									}
									value={field.value ? new Date(field.value) : null}
									onChange={date => {
										if (!date) {
											field.onChange(null)
											return
										}
										const year = date.getFullYear()
										const month = String(date.getMonth() + 1).padStart(2, '0')
										const day = String(date.getDate()).padStart(2, '0')
										field.onChange(`${year}-${month}-${day}`)
									}}
								/>
							</div>
						)}
					/>
				</div>
			</div>
		</form>
	)
}
