import { IconArrowUp } from '@consta/icons/IconArrowUp'
import { IconArtBrush } from '@consta/icons/IconArtBrush'
// import { IconCards } from '@consta/icons/IconCards'
import { IconColumns } from '@consta/icons/IconColumns'
import { IconPanelBottom } from '@consta/icons/IconPanelBottom'
import { IconPhoto } from '@consta/icons/IconPhoto'
import { IconShare } from '@consta/icons/IconShare'
import { IconType } from '@consta/icons/IconType'
import { Element } from '@craftjs/core'
import React from 'react'

import type { ComponentConfig } from './types'
import {
	MjmlBlock,
	MjmlButton,
	MjmlHtml,
	MjmlImage,
	MjmlSection,
	MjmlSocialBlock,
	MjmlSocialElement,
	MjmlSpacer,
	MjmlText
} from '@/entities/EditorBlocks'

/**
 * Список компонентов для библиотеки компонентов
 */
export const COMPONENTS: ComponentConfig[] = [
	{
		icon: IconColumns,
		title: 'Сетки',
		component: React.createElement(
			MjmlSection,
			{},
			React.createElement(Element, { is: MjmlBlock, canvas: true }),
			React.createElement(Element, { is: MjmlBlock, canvas: true })
		)
	},
	// {
	// 	icon: IconCards,
	// 	title: 'Блок',
	// 	component: MjmlBlock,
	// 	isCanvas: true
	// },
	{
		icon: IconType,
		title: 'Текст',
		component: MjmlText,
		componentProps: { text: 'Новый текст' }
	},
	{
		icon: IconPhoto,
		title: 'Картинка',
		component: MjmlImage
	},
	{
		icon: IconPanelBottom,
		title: 'Кнопка',
		component: MjmlButton,
		componentProps: { text: 'Кнопка' }
	},
	{
		icon: IconArrowUp,
		title: 'Отступ',
		component: MjmlSpacer
	},
	{
		icon: IconArtBrush,
		title: 'Редактор',
		component: MjmlHtml,
		componentProps: { html: '<div>Текстовый редактор</div>' }
	},
	{
		icon: IconShare,
		title: 'Соцсети',
		component: MjmlSocialBlock,
		componentProps: {
			children: [
				React.createElement(Element, {
					key: 'vk',
					is: MjmlSocialElement,
					href: '#',
					src: '/assets/social/vk.png',
					alt: 'VK'
				}),
				React.createElement(Element, {
					key: 'tg',
					is: MjmlSocialElement,
					href: '#',
					src: '/assets/social/telegram.png',
					alt: 'Telegram'
				}),
				React.createElement(Element, {
					key: 'whatsapp',
					is: MjmlSocialElement,
					href: '#',
					src: '/assets/social/whatsapp.png',
					alt: 'WhatsApp'
				}),
				React.createElement(Element, {
					key: 'yt',
					is: MjmlSocialElement,
					href: '#',
					src: '/assets/social/youtube.png',
					alt: 'YouTube'
				})
			]
		},
		isCanvas: true
	}
]
