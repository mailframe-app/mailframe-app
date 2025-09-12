import { Switch } from '@consta/uikit/Switch'
import { useNode } from '@craftjs/core'
import { useEffect, useState } from 'react'

import { TiptapEditor } from './TiptapEditor'

export const MjmlHtmlSettings = () => {
	const {
		actions: { setProp },
		html,
		isWide
	} = useNode(node => ({
		html: node.data.props.html,
		isWide: node.data.props.isWide || false
	}))

	const [htmlValue, setHtmlValue] = useState(html || '<div>HTML код</div>')

	useEffect(() => {
		setHtmlValue(html || '<div>HTML код</div>')
	}, [html])

	const handleHtmlChange = (value: string) => {
		setHtmlValue(value)
		setProp((props: Record<string, unknown>) => {
			props.html = value
		})
	}

	const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProp((props: Record<string, unknown>) => {
			props.isWide = e.target.checked
		})
	}

	return (
		<div className='space-y-6'>
			<div>
				<div className='mt-4 flex items-center justify-end gap-2 pb-4'>
					<Switch checked={isWide} onChange={handleWidthChange} label='Широкий редактор' />
				</div>
				<TiptapEditor value={htmlValue} onChange={handleHtmlChange} />
			</div>
		</div>
	)
}
