export function formatDate(date: string | Date | undefined | null): string {
	if (!date) {
		return ''
	}

	const createdAtObj = new Date(date)

	if (isNaN(createdAtObj.getTime())) {
		return ''
	}

	const datePart = new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long'
	}).format(createdAtObj)

	const timePart = new Intl.DateTimeFormat('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(createdAtObj)

	if (!datePart || !timePart) {
		return ''
	}

	return `${datePart} в ${timePart}`
}
