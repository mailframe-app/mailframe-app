import React from 'react'

import { modals } from '../model/store'

export const ModalRoot: React.FC = () => {
	const { stack } = modals.use()
	const current = stack[stack.length - 1]
	if (!current) return null
	return <>{current.render({ close: () => modals.close(current.id) })}</>
}
