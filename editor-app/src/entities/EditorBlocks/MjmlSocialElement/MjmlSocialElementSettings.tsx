import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useNode } from '@craftjs/core'
import React from 'react'

import type { MjmlSocialElementProps } from './MjmlSocialElement.types'

export const MjmlSocialElementSettings: React.FC = () => {
	const {
		actions: { setProp },
		href,
		src,
		alt
	} = useNode<MjmlSocialElementProps>(node => ({
		href: node.data.props.href,
		src: node.data.props.src,
		alt: node.data.props.alt
	}))

	return (
		<div className='space-y-4'>
			<div>
				<Text view='secondary' size='s' className='mb-2 block'>
					Ссылка для перехода
				</Text>
				<TextField
					value={href}
					onChange={value =>
						setProp((props: MjmlSocialElementProps) => (props.href = value || '#'))
					}
				/>
			</div>
			<div>
				<Text view='secondary' size='s' className='mb-2 block'>
					Ссылка на иконку (URL)
				</Text>
				<TextField
					value={src}
					onChange={value => setProp((props: MjmlSocialElementProps) => (props.src = value || ''))}
				/>
			</div>
			<div>
				<Text view='secondary' size='s' className='mb-2 block'>
					Альтернативный текст
				</Text>
				<TextField
					value={alt}
					onChange={value => setProp((props: MjmlSocialElementProps) => (props.alt = value || ''))}
				/>
			</div>
		</div>
	)
}
