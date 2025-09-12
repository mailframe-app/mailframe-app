import React, { createContext, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { LoginFormType } from '../ui/LoginForm'

import { useLoginMutations } from './use-login'

interface AuthContextType {
	ticket: string | null
	methods: string[]
	userId: string | null
	isLoginPending: boolean
	isVerifyingTotp: boolean
	isVerifyingRecovery: boolean
	showMfa: boolean
	login: (data: LoginFormType) => Promise<void>
	verifyWithTotp: (code: string) => Promise<void>
	verifyWithRecovery: (code: string) => Promise<void>
	resetMfa: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [methods, setMethods] = useState<string[]>([])
	const [ticket, setTicket] = useState<string | null>(null)
	const [userId, setUserId] = useState<string | null>(null)
	const navigate = useNavigate()

	const {
		loginMutate,
		isLoginPending,
		verifyTotpMutate,
		isVerifyingTotp,
		verifyRecoveryMutate,
		isVerifyingRecovery
	} = useLoginMutations({ setTicket, setMethods, setUserId, navigate })

	const login = async (data: LoginFormType) => {
		await loginMutate(data)
	}

	const verifyWithTotp = async (code: string) => {
		if (!ticket) return
		await verifyTotpMutate({ ticket, totpCode: code })
	}

	const verifyWithRecovery = async (code: string) => {
		if (!ticket) return
		await verifyRecoveryMutate({ ticket, recoveryCode: code })
	}

	const resetMfa = () => {
		setTicket(null)
		setMethods([])
		setUserId(null)
	}

	const value = useMemo(
		() => ({
			ticket,
			methods,
			userId,
			isLoginPending,
			isVerifyingTotp,
			isVerifyingRecovery,
			showMfa: !!ticket && methods.length > 0,
			login,
			verifyWithTotp,
			verifyWithRecovery,
			resetMfa
		}),
		[
			ticket,
			methods,
			userId,
			isLoginPending,
			isVerifyingTotp,
			isVerifyingRecovery
		]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
