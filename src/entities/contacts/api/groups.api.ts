import { apiInstance, handleApiError } from '@/shared/api'

import type {
	BulkDeleteGroupsDto,
	BulkOperationResponseDto,
	CloneGroupDto,
	CloneGroupResponseDto,
	CreateGroupDto,
	GetGroupsQueryDto,
	GroupMembersDto,
	GroupMembershipResponseDto,
	GroupResponseDto,
	GroupsResponseDto,
	MergeGroupsDto,
	UpdateGroupDto
} from './types'

// POST /api/v1/contacts/groups - Создание новой группы контактов
export const createGroup = async (
	payload: CreateGroupDto
): Promise<GroupResponseDto> => {
	try {
		const { data } = await apiInstance.post<GroupResponseDto>(
			'/v1/contacts/groups',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts/groups - Получение списка групп
export const getGroups = async (
	params?: GetGroupsQueryDto
): Promise<GroupsResponseDto> => {
	try {
		const { data } = await apiInstance.get<GroupsResponseDto>(
			'/v1/contacts/groups',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /api/v1/contacts/groups/{id} - Обновление группы контактов
export const updateGroup = async (
	id: string,
	payload: UpdateGroupDto
): Promise<GroupResponseDto> => {
	try {
		const { data } = await apiInstance.patch<GroupResponseDto>(
			`/v1/contacts/groups/${id}`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /api/v1/contacts/groups/{id} - Удаление группы контактов
export const deleteGroup = async (id: string): Promise<void> => {
	try {
		await apiInstance.delete<void>(`/v1/contacts/groups/${id}`)
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/groups/{id}/members - Добавление контактов в группу
export const addMembersToGroup = async (
	id: string,
	payload: GroupMembersDto
): Promise<GroupMembershipResponseDto> => {
	try {
		const { data } = await apiInstance.post<GroupMembershipResponseDto>(
			`/v1/contacts/groups/${id}/members`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /api/v1/contacts/groups/{id}/members - Удаление контактов из группы
export const removeMembersFromGroup = async (
	id: string,
	payload: GroupMembersDto
): Promise<GroupMembershipResponseDto> => {
	try {
		const { data } = await apiInstance.delete<GroupMembershipResponseDto>(
			`/v1/contacts/groups/${id}/members`,
			{ data: payload }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/groups/{id}/clone - Клонирование группы контактов
export const cloneGroup = async (
	id: string,
	payload: CloneGroupDto
): Promise<CloneGroupResponseDto> => {
	try {
		const { data } = await apiInstance.post<CloneGroupResponseDto>(
			`/v1/contacts/groups/${id}/clone`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /api/v1/contacts/groups/bulk/delete - Массовое удаление групп контактов
export const bulkDeleteGroups = async (
	payload: BulkDeleteGroupsDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.delete<BulkOperationResponseDto>(
			'/v1/contacts/groups/bulk/delete',
			{ data: payload }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/groups/bulk/merge - Объединение групп контактов
export const mergeGroups = async (
	payload: MergeGroupsDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.post<BulkOperationResponseDto>(
			'/v1/contacts/groups/bulk/merge',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
