import { IconEdit } from '@consta/icons/IconEdit'
import { useRef, useState } from 'react'

import {
	type ProfileResponse,
	useUploadAvatarMutation
} from '@/entities/profile'
import noAvatar from '@/pages/settings/assets/no-avatar.png'

interface ChangeAvatarProps {
	profile: ProfileResponse | undefined
}

export const ChangeAvatar = ({ profile }: ChangeAvatarProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isUploading, setIsUploading] = useState(false)
	const uploadAvatarMutation = useUploadAvatarMutation()

	const handleEditClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			setIsUploading(true)
			await uploadAvatarMutation.mutateAsync(file)
		} finally {
			setIsUploading(false)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	return (
		<div className='relative'>
			<img
				src={profile?.avatar || noAvatar}
				alt='avatar'
				className='h-40 w-40 rounded-full object-cover'
			/>
			<input
				type='file'
				ref={fileInputRef}
				onChange={handleFileChange}
				accept='image/png,image/jpeg,image/jpg,image/webp'
				className='hidden'
			/>
			<div
				onClick={handleEditClick}
				className={`absolute right-0 bottom-0 flex cursor-pointer items-center justify-center ${
					isUploading ? 'opacity-50' : ''
				}`}
				style={{
					background: 'var(--color-bg-default)',
					border: '1px solid var(--color-bg-ghost)',
					width: '40px',
					height: '40px',
					borderRadius: '50%'
				}}
			>
				<IconEdit view='secondary' size='s' form='round' />
			</div>
		</div>
	)
}
