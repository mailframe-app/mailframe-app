import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import React from 'react'

interface ThemeProviderProps {
	children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	return <Theme preset={presetGpnDefault}>{children}</Theme>
}
