import { useEditor, useNode } from '@craftjs/core'
import React, { useEffect, useRef } from 'react'

import type { MjmlTextProps } from './MjmlText.types'
import { MjmlTextSettings } from './MjmlTextSettings'
import { markdownToHtml } from './utils'

function parseMarkdownLink(md?: string) {
	if (!md) return null
	const match = md.match(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)(?:\{([^}]+)\})?/)
	if (!match) return null
	const text = match[1] || ''
	const url = match[2] || ''
	const attr = match[3] || ''
	const underline = /underline/.test(attr)
	return { text, url, underline }
}

function buildMarkdownLink({
	text,
	url,
	underline
}: {
	text: string
	url: string
	underline: boolean
}) {
	const attr: string[] = []
	if (underline) attr.push('underline')
	return attr.length ? `[${text}](${url}){${attr.join(' ')}}` : `[${text}](${url})`
}

export const MjmlText = ({
	text,
	fontSize,
	fontFamily,
	fontWeight,
	fontStyle,
	textDecoration,
	textTransform,
	textAlign,
	lineHeight,
	color,
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft
}: MjmlTextProps) => {
	const {
		connectors: { connect, drag },
		setProp: setPropBase,
		id
	} = useNode()

	type SetProp = (cb: (props: MjmlTextProps) => void, throttleRate?: number) => void
	const setProp: SetProp = setPropBase as unknown as SetProp

	const { active } = useEditor(state => ({
		active: state.nodes[id]?.events.selected
	}))

	const parsed = parseMarkdownLink(text)

	const sharedStyles: React.CSSProperties = {
		fontSize,
		fontFamily,
		fontWeight,
		fontStyle,
		textDecoration,
		textTransform,
		textAlign,
		lineHeight,
		color,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft
	}

	const activeStyles: React.CSSProperties = {
		...sharedStyles,
		marginLeft: '-10px',
		marginRight: '-10px',
		paddingLeft: `calc(${paddingLeft || '0px'} + 10px)`,
		paddingRight: `calc(${paddingRight || '0px'} + 10px)`
	}

	const wrapperRef = useRef<HTMLDivElement | null>(null)
	const dragHandleRef = useRef<HTMLDivElement | null>(null)
	const editorRef = useRef<HTMLDivElement | null>(null)
	const draftRef = useRef<string>('')
	const wasActiveRef = useRef<boolean>(false)

	useEffect(() => {
		if (wrapperRef.current) connect(wrapperRef.current)
		if (dragHandleRef.current) drag(dragHandleRef.current)
	}, [connect, drag])

	useEffect(() => {
		if (active && editorRef.current) {
			const initial = parsed?.text ?? text ?? ''
			editorRef.current.innerText = initial || 'Новый текст'
			draftRef.current = editorRef.current.innerText
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active])

	const commit = (value: string) => {
		setProp(props => {
			if (parsed?.url) {
				props.text = buildMarkdownLink({
					text: value,
					url: parsed.url,
					underline: parsed.underline
				})
			} else {
				props.text = value
			}
		})
	}

	useEffect(() => {
		if (wasActiveRef.current && !active) {
			commit(draftRef.current)
		}
		wasActiveRef.current = active
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active])

	return (
		<div
			ref={wrapperRef}
			style={{
				paddingLeft: '10px',
				paddingRight: '10px',
				boxSizing: 'border-box',
				overflow: 'visible',
				wordBreak: 'break-word',
				overflowWrap: 'anywhere',
				whiteSpace: 'normal'
			}}
		>
			<div
				ref={editorRef}
				style={active ? activeStyles : sharedStyles}
				contentEditable={!!active}
				suppressContentEditableWarning
				onMouseDown={e => active && e.stopPropagation()}
				onClick={e => active && e.stopPropagation()}
				onInput={e => {
					draftRef.current = (e.currentTarget as HTMLDivElement).innerText
					commit(draftRef.current)
				}}
				onBlurCapture={() => {
					commit(draftRef.current)
				}}
				{...(!active
					? { dangerouslySetInnerHTML: { __html: markdownToHtml(text || '') } }
					: undefined)}
			/>
		</div>
	)
}

MjmlText.craft = {
	props: {
		text: 'Введите текст...',
		tag: 'p',
		fontSize: '14px',
		fontFamily: 'Arial',
		fontWeight: 'normal',
		fontStyle: 'normal',
		textDecoration: 'none',
		textTransform: 'none',
		textAlign: 'left',
		lineHeight: '1.5',
		color: '#33363C',
		paddingTop: '0px',
		paddingRight: '0px',
		paddingBottom: '0px',
		paddingLeft: '0px'
	},
	name: 'Текст',
	related: {
		settings: MjmlTextSettings
	}
}
