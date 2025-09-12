import { useMutation } from '@tanstack/react-query'

import {
	addMembersToGroup,
	bulkDeleteGroups,
	cloneGroup,
	createGroup,
	deleteGroup,
	mergeGroups,
	removeMembersFromGroup,
	updateGroup
} from '../../api/groups.api'
import type {
	BulkDeleteGroupsDto,
	CloneGroupDto,
	CreateGroupDto,
	GroupMembersDto,
	MergeGroupsDto,
	UpdateGroupDto
} from '../../api/types'
import { useInvalidateContacts, useInvalidateGroups } from '../queries'

export function useCreateGroupMutation() {
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: (payload: CreateGroupDto) => createGroup(payload),
		onSuccess: () => {
			invalidateGroups()
		}
	})
}

export function useUpdateGroupMutation() {
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateGroupDto }) =>
			updateGroup(id, payload),
		onSuccess: () => {
			invalidateGroups()
		}
	})
}

export function useDeleteGroupMutation() {
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: (id: string) => deleteGroup(id),
		onSuccess: () => {
			invalidateGroups()
		}
	})
}

export function useBulkDeleteGroupsMutation() {
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: (payload: BulkDeleteGroupsDto) => bulkDeleteGroups(payload),
		onSuccess: () => {
			invalidateGroups()
		}
	})
}

export function useMergeGroupsMutation() {
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: (payload: MergeGroupsDto) => mergeGroups(payload),
		onSuccess: () => {
			invalidateGroups()
		}
	})
}

export function useCloneGroupMutation() {
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: CloneGroupDto }) =>
			cloneGroup(id, payload),
		onSuccess: () => {
			invalidateGroups()
		}
	})
}

export function useAddMembersToGroupMutation() {
	const invalidateContacts = useInvalidateContacts()
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: GroupMembersDto }) =>
			addMembersToGroup(id, payload),
		onSuccess: () => {
			invalidateContacts()
			invalidateGroups()
		}
	})
}

export function useRemoveMembersFromGroupMutation() {
	const invalidateContacts = useInvalidateContacts()
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: GroupMembersDto }) =>
			removeMembersFromGroup(id, payload),
		onSuccess: () => {
			invalidateContacts()
			invalidateGroups()
		}
	})
}
