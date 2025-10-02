import { IconCheck } from '@consta/icons/IconCheck'
import { Badge } from '@consta/uikit/Badge'
import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './SelectCard.css'

export type SelectItem = {
	id: string
	label: string
}

type SelectCardProps = {
	title: string
	description: string
	selectLabel: string
	selectPlaceholder: string
	items: SelectItem[]
	value: SelectItem | null
	onSelect: (item: SelectItem | null) => void
	selectHelpText?: string
	linkText?: string
	linkUrl?: string
	stepNumber?: number
	isLoading?: boolean
	withSearch?: boolean
}

const SelectCard: React.FC<SelectCardProps> = ({
	title,
	description,
	selectLabel,
	onSelect,
	selectPlaceholder,
	items,
	value,
	selectHelpText,
	linkText,
	linkUrl,
	stepNumber,
	isLoading = false,
	withSearch = false
}) => {
	const navigate = useNavigate()
	const [searchValue, setSearchValue] = useState('')
	const [internalValue, setInternalValue] = useState(value)

	useEffect(() => {
		setInternalValue(value)
	}, [value])

	const filteredItems = useMemo(() => {
		if (!searchValue) {
			return items
		}
		return items.filter(item =>
			item.label.toLowerCase().includes(searchValue.toLowerCase())
		)
	}, [searchValue, items])

	const handleLinkClick = () => {
		if (linkUrl) {
			navigate(linkUrl)
		}
	}

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='w-full !rounded-lg'
			style={{
				backgroundColor: 'var(--color-bg-default)'
			}}
			shadow={false}
		>
			<div className='flex items-center justify-between'>
				<Text
					as='h3'
					size='xl'
					weight='semibold'
					className='m-0'
					view='primary'
				>
					{title}
				</Text>
				{value ? (
					<Badge
						size='l'
						iconLeft={IconCheck}
						form='round'
						className='border-primary text-primary border bg-transparent'
					/>
				) : (
					<Badge
						size='l'
						label={stepNumber ? String(stepNumber) : undefined}
						form='round'
						status='system'
						className='border border-gray-300 bg-transparent text-gray-400'
					/>
				)}
			</div>

			<Text as='p' size='m' view='secondary' className='mb-8'>
				{description}
			</Text>
			<Text as='p' size='s' view='secondary' className='mb-2'>
				{selectLabel}
			</Text>
			<Select
				size='m'
				placeholder={isLoading ? 'Загрузка...' : selectPlaceholder}
				items={withSearch ? filteredItems : items}
				value={internalValue}
				onChange={item => {
					onSelect(item)
					setInternalValue(item)
					if (withSearch) {
						setSearchValue('')
					}
				}}
				input={withSearch}
				onInput={setSearchValue}
				onFocus={() => {
					if (withSearch) {
						setInternalValue(null)
					}
				}}
				onBlur={() => {
					if (withSearch) {
						if (internalValue === null) {
							setInternalValue(value)
						}
						setSearchValue('')
					}
				}}
				className='custom-select mb-2'
				disabled={isLoading}
			/>
			{(selectHelpText || linkText) && (
				<Layout className='items-center justify-start gap-1.5'>
					{selectHelpText && (
						<Text as='p' size='xs' view='secondary' className='m-0'>
							{selectHelpText}
						</Text>
					)}
					{linkText && linkUrl && (
						<Text
							className='text-primary cursor-pointer'
							as='span'
							weight='medium'
							size='xs'
							onClick={handleLinkClick}
							view='link'
						>
							{linkText}
						</Text>
					)}
				</Layout>
			)}
		</Card>
	)
}

export { SelectCard }
