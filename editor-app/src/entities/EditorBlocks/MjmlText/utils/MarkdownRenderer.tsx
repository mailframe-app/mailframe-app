import React, { type AnchorHTMLAttributes } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import type { MarkdownComponentProps } from './markdownStyles'
import { markdownStyles } from './markdownStyles'

interface MarkdownRendererProps {
	text: string
}

// Функция парсинга атрибутов {color="#hex" underline}
function parseLinkAttrs(title: string | null) {
	if (!title) return {}
	const attrPattern = /(\w+)="([^"]+)"|underline/g
	let color: string | undefined
	let underline = false
	let match
	while ((match = attrPattern.exec(title))) {
		if (match[1] === 'color') color = match[2]
		if (match[0] === 'underline') underline = true
	}
	return { color, underline }
}

// Патчим входящий markdown: переносим {...} из текста в title
function patchLinkAttrs(md: string) {
	return md.replace(
		/\[([^\]]+)\]\(([^)]+)\)\{([^}]+)\}/g,
		(_m, text, url, attrs) => `[${text}](${url} "${attrs}")`
	)
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
	// Компоненты для рендеринга Markdown
	const MarkdownComponents: Record<string, React.FC<MarkdownComponentProps>> = {
		ul: props => <ul style={markdownStyles.ul} {...props} />,
		ol: props => <ol style={markdownStyles.ol} {...props} />,
		li: props => <li style={markdownStyles.li} {...props} />,
		table: props => <table style={markdownStyles.table} {...props} />,
		th: props => <th style={markdownStyles.th} {...props} />,
		td: props => <td style={markdownStyles.td} {...props} />,
		p: props => <p style={markdownStyles.p} {...props} />,
		h1: props => <h1 style={markdownStyles.h1} {...props} />,
		h2: props => <h2 style={markdownStyles.h2} {...props} />,
		h3: props => <h3 style={markdownStyles.h3} {...props} />,
		h4: props => <h4 style={markdownStyles.h4} {...props} />,
		blockquote: props => <blockquote style={markdownStyles.blockquote} {...props} />,
		code: ({ className, children, ...props }) => {
			const match = /language-(\w+)/.exec(className || '')
			const language = match ? match[1] : null

			if (language) {
				return (
					<code
						style={{
							...markdownStyles.codeBlock,
							display: 'block'
						}}
						className={`language-${language}`}
						{...props}
					>
						{children}
					</code>
				)
			}

			return (
				<code style={markdownStyles.code} {...props}>
					{children}
				</code>
			)
		},
		pre: ({ children, ...props }) => (
			<pre style={markdownStyles.pre} {...props}>
				{children}
			</pre>
		),
		thead: props => <thead style={markdownStyles.thead} {...props} />,
		tbody: props => <tbody style={markdownStyles.tbody} {...props} />,
		tr: props => <tr style={markdownStyles.tr} {...props} />,
		a: ({
			href,
			title,
			children,
			...props
		}: React.PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => {
			const { color, underline } = parseLinkAttrs(typeof title === 'string' ? title : '')
			return (
				<a
					href={typeof href === 'string' ? href : undefined}
					style={{
						color: color || '#0072E6',
						textDecoration: underline ? 'underline' : 'none',
						cursor: 'pointer'
					}}
					target='_blank'
					rel='noopener noreferrer'
					{...props}
				>
					{children}
				</a>
			)
		}
	}

	const patchedText = patchLinkAttrs(text)

	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
			{patchedText}
		</ReactMarkdown>
	)
}
