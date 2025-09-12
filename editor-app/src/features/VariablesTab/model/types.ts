export interface IDbField {
	label: string
	value: string
}

export interface IVariableItem {
	id: string
	token: string
	field?: IDbField | null
	defaultValue?: string
	required?: boolean
}

export type TVariableMapping = Record<
	string,
	{ fieldKey: string; default?: string; required?: boolean }
>
