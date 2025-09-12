import { IconFavoriteFilled } from '@consta/icons/IconFavoriteFilled'
import { IconFolderClosed } from '@consta/icons/IconFolderClosed'
import { IconTrash } from '@consta/icons/IconTrash'
import { IconWatchFilled } from '@consta/icons/IconWatchFilled'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import React from 'react'

import { CreateFolderModal, UploadFilesContainer, useCreateFolder } from '@/features/Storage'

import { type ActiveView, formatFileSize, useStorageStore } from '@/entities/Storage'

type IconComponent = React.FC<React.SVGProps<SVGSVGElement> & { size: 's' | 'm' | 'xs' | 'l' }>
interface NavItemProps {
	icon: IconComponent
	label: string
	view: ActiveView
	isActive: boolean
	onClick: (view: ActiveView) => void
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, view, isActive, onClick }) => {
	const activeStyle = {
		color: 'var(--color-typo-link)'
	}
	const inactiveStyle = {
		color: 'var(--color-typo-secondary)'
	}

	const [isHovered, setIsHovered] = React.useState(false)

	return (
		<button
			onClick={() => onClick(view)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={
				isActive ? activeStyle : isHovered ? { backgroundColor: 'var(--color-bg-secondary)' } : {}
			}
			className='flex items-center gap-2 rounded-md p-2 text-left text-sm font-medium'
		>
			<Icon size='s' style={isActive ? activeStyle : inactiveStyle} />
			<Text view={isActive ? 'link' : 'secondary'} size='s'>
				{label}
			</Text>
		</button>
	)
}

export const StorageModalNavigation = () => {
	const { activeView, setActiveView, stats } = useStorageStore()
	const {
		isModalOpen: isCreateFolderModalOpen,
		loading: createFolderLoading,
		openModal: openCreateFolderModal,
		closeModal: closeCreateFolderModal,
		handleCreateFolder
	} = useCreateFolder()

	const [isUploadFilesModalOpen, setIsUploadFilesModalOpen] = React.useState(false)

	const openUploadFilesModal = () => {
		setIsUploadFilesModalOpen(true)
	}

	const closeUploadFilesModal = () => {
		setIsUploadFilesModalOpen(false)
	}

	const navItems: Omit<NavItemProps, 'isActive' | 'onClick'>[] = [
		{ icon: IconFolderClosed, label: 'Файлы', view: 'files' },
		{ icon: IconWatchFilled, label: 'Последние', view: 'recent' },
		{ icon: IconFavoriteFilled, label: 'Избранное', view: 'favorites' },
		{ icon: IconTrash, label: 'Корзина', view: 'trash' }
	]

	return (
		<Layout direction='column' className='w-[15vw] gap-2 p-8'>
			<Button
				view='primary'
				size='m'
				label='Загрузить'
				className='mb-2'
				onClick={openUploadFilesModal}
			/>
			<Button
				view='secondary'
				size='m'
				label='Создать папку'
				className='mb-4'
				onClick={openCreateFolderModal}
			/>
			{navItems.map(item => (
				<NavItem
					key={item.view}
					{...item}
					isActive={activeView === item.view}
					onClick={setActiveView}
				/>
			))}

			<Text size='s' view='secondary' weight='regular' className='mt-auto'>
				Всего файлов: {stats?.totalFiles}
				<br />
				Использовано: {formatFileSize(stats?.totalSize ?? 0)}
			</Text>

			<CreateFolderModal
				isOpen={isCreateFolderModalOpen}
				onClose={closeCreateFolderModal}
				onSubmit={handleCreateFolder}
				loading={createFolderLoading}
			/>

			<UploadFilesContainer isOpen={isUploadFilesModalOpen} onClose={closeUploadFilesModal} />
		</Layout>
	)
}
