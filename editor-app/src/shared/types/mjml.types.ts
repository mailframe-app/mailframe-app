import React from 'react'

/**
 * Базовый интерфейс для всех MJML компонентов
 */
export interface MjmlProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
}
