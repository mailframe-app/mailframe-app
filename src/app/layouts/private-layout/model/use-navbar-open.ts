import { useCallback, useEffect, useState } from 'react'

export function useNavbarOpen() {
	const [isOpen, setOpen] = useState<boolean>(
		() => localStorage.getItem('navbar_open') !== '0'
	)
	useEffect(() => {
		localStorage.setItem('navbar_open', isOpen ? '1' : '0')
	}, [isOpen])
	const toggle = useCallback(() => setOpen(s => !s), [])
	return { isOpen, setOpen, toggle }
}
