import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useNode } from '@craftjs/core'

// Settings Panel
export const MjmlColumnSettings = () => {
	const {
		actions: { setProp },
		width
	} = useNode(node => ({
		width: node.data.props.width
	}))

	return (
		<div className='space-y-4'>
			<Text view='secondary' size='s'>
				Width
			</Text>
			<TextField
				value={width}
				onChange={value => setProp((props: { width: string }) => (props.width = value || '100%'))}
				placeholder='e.g. 50%'
			/>
		</div>
	)
}
