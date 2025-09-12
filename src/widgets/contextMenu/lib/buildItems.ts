import type { ContextMenuItem } from '@/widgets/contextMenu/model/types'

export type ItemDef<Row> = Omit<ContextMenuItem<Row>, 'onClick'> & {
	onClick: (row: Row) => void
}

export function buildItems<Row>(
	row: Row,
	defs: ItemDef<Row>[]
): ContextMenuItem<Row>[] {
	return defs.map(def => ({
		...def,
		onClick: (_: Row) => def.onClick(row)
	}))
}
