import type { ReactNode } from 'react'

export interface Provider {
	name: string
	icon: ReactNode
	key: 'google' | 'yandex'
	description: string
}
