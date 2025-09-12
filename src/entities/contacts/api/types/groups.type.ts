export interface BulkDeleteGroupsDto {
	groupIds: string[]
}

export interface MergeGroupsDto {
	sourceGroupIds: string[]
	targetGroupId: string
	deleteSourceGroups?: boolean
}

export interface BulkOperationResponseDto {
	success: boolean
	processed: number
	failed: number
	failedIds?: string[]
	errors?: string[]
}

export interface CloneGroupDto {
	newName?: string
	includeMembers?: boolean
}

export interface CloneGroupResponseDto {
	success: boolean
	newGroupId: string
	newGroupName: string
	contactsCopied: number
}

export interface CreateGroupDto {
	name: string
	description?: string
	color?: string
}

export type GroupsSortBy = 'name' | 'createdAt' | 'updatedAt'
export type SortOrder = 'asc' | 'desc'

export interface GetGroupsQueryDto {
	page?: number
	limit?: number
	search?: string
	sortBy?: GroupsSortBy
	order?: SortOrder
}

export interface GroupMembersDto {
	contactIds: string[]
}

export interface GroupMembershipResponseDto {
	success: boolean
	added?: number
	removed?: number
	failed?: number
	failedIds?: string[]
	errors?: string[]
}

export interface GroupStatsDto {
	contactsCount: number
	lastUpdated: string
}

export interface GroupResponseDto {
	id: string
	name: string
	description?: string
	color?: string
	createdAt: string
	updatedAt: string
	stats: GroupStatsDto
}

export interface GroupsResponseDto {
	items: GroupResponseDto[]
	total: number
}

export interface UpdateGroupDto {
	name?: string
	description?: string
	color?: string
}
