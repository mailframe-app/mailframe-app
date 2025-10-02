import { DatePicker } from '@consta/uikit/DatePicker'
import { Layout } from '@consta/uikit/Layout'
import { Radio } from '@consta/uikit/Radio'
import React from 'react'

interface SendingCardProps {
	campaignId: string
	onSendOptionChange: (option: 'now' | 'scheduled') => void
	onDatetimeChange: (date: Date | null) => void
	sendOption: 'now' | 'scheduled'
	datetime: Date | null
}

export const SendingCard: React.FC<SendingCardProps> = ({
	sendOption,
	datetime,
	onSendOptionChange,
	onDatetimeChange
}) => {
	return (
		<Layout
			direction='column'
			className='items-start justify-start gap-4 px-4 pt-4'
		>
			<Radio
				label='Отправить сейчас'
				checked={sendOption === 'now'}
				onChange={() => onSendOptionChange('now')}
			/>

			<Radio
				label='Отправить в заданное время'
				checked={sendOption === 'scheduled'}
				onChange={() => onSendOptionChange('scheduled')}
			/>

			{sendOption === 'scheduled' && (
				<Layout direction='column' className='gap-4'>
					<DatePicker
						label='Дата и время запуска'
						type='date-time'
						value={datetime}
						onChange={onDatetimeChange}
					/>
				</Layout>
			)}
		</Layout>
	)
}
