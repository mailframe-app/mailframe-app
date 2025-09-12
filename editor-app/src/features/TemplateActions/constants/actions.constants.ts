import { IconDocExport } from '@consta/icons/IconDocExport'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconExit } from '@consta/icons/IconExit'
import { IconMail } from '@consta/icons/IconMail'
import { IconTrash } from '@consta/icons/IconTrash'

export const menuItems = [
	{
		id: 'sendTestEmail',
		label: 'Отправить тестовое письмо',
		leftIcon: IconMail
	},
	// {
	// 	id: 'export',
	// 	label: 'Скачать шаблон',
	// 	leftIcon: IconDownload
	// },
	{
		id: 'rename',
		label: 'Переименовать шаблон',
		leftIcon: IconEdit
	},
	{
		id: 'copy',
		label: 'Скопировать шаблон',
		leftIcon: IconDocExport
	},
	{
		id: 'delete',
		label: 'Удалить шаблон',
		status: 'alert' as const,
		leftIcon: IconTrash
	},
	{
		id: 'close',
		label: 'Выйти',
		leftIcon: IconExit
	}
] as const
