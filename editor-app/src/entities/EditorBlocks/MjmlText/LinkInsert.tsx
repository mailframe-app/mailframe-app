import { Checkbox } from '@consta/uikit/Checkbox'
import { Text as CUIText } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import React, { useEffect, useState } from 'react'

import { useTheme } from '@/features/theme'

interface LinkInsertProps {
	text?: string
	onTextUpdate?: (text: string) => void
}

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

export const LinkInsert: React.FC<LinkInsertProps> = ({ text = '', onTextUpdate }) => {
	const { theme } = useTheme()
	const parsed = parseMarkdownLink(text)
	const [open, setOpen] = useState(!!parsed)
	const [url, setUrl] = useState(parsed?.url ?? '')
	const [underline, setUnderline] = useState(parsed?.underline ?? false)

	useEffect(() => {
		const parsed = parseMarkdownLink(text)
		setOpen(!!parsed)
		setUrl(parsed?.url ?? '')
		setUnderline(parsed?.underline ?? false)
	}, [text])

	useEffect(() => {
		if (!onTextUpdate || !open) return
		if (url) {
			onTextUpdate(buildMarkdownLink({ text: parsed?.text || text, url, underline }))
		}
	}, [url, underline, open]) // eslint-disable-line

	const handleToggle = (checked: boolean) => {
		setOpen(checked)
		if (!checked && onTextUpdate) {
			onTextUpdate(parsed?.text || text)
		}
	}

	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' view='primary'>
					Ссылка
				</CUIText>
				<Checkbox
					checked={open}
					onChange={e => handleToggle(e.target.checked)}
					label='Добавить ссылку'
					size='s'
				/>
			</div>
			{open && (
				<div className='space-y-2 pt-2'>
					<div className='flex items-center justify-between'>
						<CUIText size='s' weight='light' className='w-[80px] truncate' view='primary'>
							URL <span className='text-red-500'>*</span>
						</CUIText>
						<TextField
							value={url}
							onChange={value => setUrl(value ?? '')}
							size='s'
							view='default'
							className='rounded-lg pl-[15px]'
							style={
								{
									'--color-control-bg-default':
										theme === 'presetGpnDefault' ? '#F8FAFC' : 'var(--color-bg-secondary)!important'
								} as React.CSSProperties
							}
							placeholder='Введите ссылку'
						/>
					</div>
				</div>
			)}
		</div>
	)
}
