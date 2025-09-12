import { IconTrash } from '@consta/icons/IconTrash'
import { IconUnlock } from '@consta/icons/IconUnlock'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'

import { ChangeAvatar } from '@/features/profile/change-avatar'
import { usePasswordChangeModal } from '@/features/profile/change-password'
import { EditProfileForm } from '@/features/profile/edit-profile'

import { useProfile } from '@/entities/profile'

function SettingsPage() {
	const profile = useProfile()
	const { openPasswordChangeModal } = usePasswordChangeModal()

	return (
		<Layout direction='row' flex={1} className='gap-8'>
			{/* Left Card - Avatar */}
			<div className='min-w-[274px] flex-shrink-0 flex-grow basis-1/4'>
				<Card
					verticalSpace='2xl'
					horizontalSpace='2xl'
					className='flex h-full w-full flex-col items-center !rounded-2xl'
				>
					<ChangeAvatar profile={profile} />

					<Text
						view='primary'
						size='2xl'
						weight='bold'
						className='mt-4 text-center'
					>
						{profile?.displayName}
					</Text>
					<Text
						view='secondary'
						size='s'
						weight='regular'
						className='mt-2 text-center'
					>
						{profile?.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
					</Text>

					<div className='flex flex-col gap-2 pt-8'>
						{/* <Button
							view='primary'
							iconLeft={IconUser}
							label='Мой профиль'
						/> */}
						<Button
							view='clear'
							iconLeft={IconUnlock}
							label='Сменить пароль'
							onClick={openPasswordChangeModal}
						/>
						<Button
							view='clear'
							iconLeft={IconTrash}
							disabled
							label='Удалить аккаунт'
						/>
					</div>
				</Card>
			</div>

			{/* Right Card - Editor */}
			<div className='flex-shrink flex-grow basis-3/4'>
				<Card
					verticalSpace='2xl'
					horizontalSpace='2xl'
					className='h-full w-full flex-1 !rounded-2xl'
				>
					<EditProfileForm profile={profile} />
				</Card>
			</div>
		</Layout>
	)
}

export const Component = SettingsPage
