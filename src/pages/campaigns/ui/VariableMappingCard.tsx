import { Text } from '@consta/uikit/Text'

type VariableMapping = Record<string, { default: string; fieldKey: string }>

interface VariableMappingCardProps {
	mapping: VariableMapping
}

export const VariableMappingCard = ({ mapping }: VariableMappingCardProps) => {
	const variables = Object.entries(mapping)

	return (
		<div className='p-4'>
			<div className='info-row relative mb-3 flex items-center pb-3'>
				<Text
					className='w-1/3 font-mono'
					size='m'
					view='primary'
					weight='semibold'
				>
					Переменная
				</Text>
				<Text className='w-1/3' size='m' view='primary' weight='semibold'>
					Поле контакта
				</Text>
				<Text className='w-1/3' size='m' view='primary' weight='semibold'>
					Значение по умолчанию
				</Text>
			</div>
			{/* Rows */}
			{variables.map(([variable, data], index) => (
				<div
					key={variable}
					className={`flex items-center py-3 ${
						index < variables.length - 1
							? 'info-row relative mb-3 flex items-center pb-3'
							: ''
					}`}
				>
					<Text className='w-1/3 font-mono' size='m' view='primary'>
						{variable}
					</Text>
					<Text className='w-1/3' size='m' view='primary'>
						{data.fieldKey}
					</Text>
					<Text className='w-1/3' size='m' view='primary'>
						{data.default}
					</Text>
				</div>
			))}
		</div>
	)
}
