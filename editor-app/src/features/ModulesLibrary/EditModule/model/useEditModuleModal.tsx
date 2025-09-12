import { useCallback } from 'react'

import { modals } from '@/shared/lib/modals'

import type { Module } from '../../model/types'
import { EditModuleForm } from '../ui/EditModuleForm'

export const useEditModuleModal = () => {
	const openEditModal = useCallback((module: Module) => {
		modals.openContent({
			title: 'Редактировать модуль',
			content: <EditModuleForm module={module} onClose={() => modals.closeTop()} />,
			closeButton: true
		})
	}, [])

	return { openEditModal }
}
