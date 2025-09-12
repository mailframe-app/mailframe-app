import React from 'react'

// Стили для Markdown-элементов
export const markdownStyles = {
	ul: {
		listStyleType: 'disc',
		paddingLeft: '20px',
		marginTop: '8px',
		marginBottom: '8px'
	},
	ol: {
		listStyleType: 'decimal',
		paddingLeft: '20px',
		marginTop: '8px',
		marginBottom: '8px'
	},
	li: {
		marginBottom: '4px'
	},
	table: {
		borderCollapse: 'collapse' as const,
		width: '100%',
		marginTop: '8px',
		marginBottom: '8px',
		border: '1px solid #ddd'
	},
	th: {
		border: '1px solid #ddd',
		padding: '8px',
		textAlign: 'left' as const,
		backgroundColor: '#f2f2f2'
	},
	td: {
		border: '1px solid #ddd',
		padding: '8px'
	},
	tr: {
		borderBottom: '1px solid #ddd'
	},
	thead: {
		backgroundColor: '#f2f2f2'
	},
	tbody: {
		backgroundColor: '#fff'
	},
	p: {
		marginTop: '8px',
		marginBottom: '8px'
	},
	h1: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		marginTop: '16px',
		marginBottom: '8px'
	},
	h2: {
		fontSize: '1.3em',
		fontWeight: 'bold',
		marginTop: '14px',
		marginBottom: '7px'
	},
	h3: {
		fontSize: '1.2em',
		fontWeight: 'bold',
		marginTop: '12px',
		marginBottom: '6px'
	},
	h4: {
		fontSize: '1.1em',
		fontWeight: 'bold',
		marginTop: '10px',
		marginBottom: '5px'
	},
	blockquote: {
		borderLeft: '4px solid #ddd',
		paddingLeft: '16px',
		fontStyle: 'italic',
		marginLeft: '0',
		marginRight: '0'
	},
	code: {
		fontFamily: 'monospace',
		backgroundColor: '#f5f5f5',
		padding: '2px 4px',
		borderRadius: '3px'
	},
	codeBlock: {
		fontFamily: 'monospace',
		backgroundColor: '#f5f5f5',
		padding: '12px',
		borderRadius: '6px',
		marginTop: '8px',
		marginBottom: '8px',
		whiteSpace: 'pre' as const,
		overflowX: 'auto' as const,
		fontSize: '0.9em',
		lineHeight: '1.4'
	},
	pre: {
		backgroundColor: '#f5f5f5',
		padding: '8px',
		borderRadius: '3px',
		overflowX: 'auto' as const
	}
}

// Тип для компонентов Markdown
export type MarkdownComponentProps = {
	children?: React.ReactNode
	className?: string
	[key: string]: unknown
}
