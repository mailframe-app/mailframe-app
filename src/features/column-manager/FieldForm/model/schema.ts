import { z } from 'zod'

export const FieldType = z.enum([
	'TEXT',
	'EMAIL',
	'PHONE',
	'URL',
	'DATE',
	'NUMBER',
	'TEXTAREA',
	'SELECT'
] as const)

export const optionSchema = z.object({
	label: z
		.string({
			error: i => (i.input === undefined ? 'Обязательно' : 'Неверный тип')
		})
		.trim()
		.min(1, { message: 'Обязательно' }),
	value: z
		.string({
			error: i => (i.input === undefined ? 'Обязательно' : 'Неверный тип')
		})
		.trim()
		.min(1, { message: 'Обязательно' })
})

export const baseSchema = z.object({
	name: z
		.string({
			error: i => (i.input === undefined ? 'Обязательно' : 'Неверный тип')
		})
		.trim()
		.min(2, { message: 'Минимум 2 символа' }),
	isRequired: z.boolean().optional().default(false),
	isVisible: z.boolean().optional().default(true),
	columnWidth: z.coerce
		.number()
		.int()
		.min(50, { message: 'Минимум 50' })
		.max(500, { message: 'Максимум 500' }),
	isSystem: z.boolean().optional().default(false)
})

export const userEditableSchema = z.object({
	key: z
		.string({
			error: i => (i.input === undefined ? 'Обязательно' : 'Неверный тип')
		})
		.trim()
		.min(2, { message: 'Минимум 2 символа' })
		.regex(/^[a-z][a-z0-9_]*$/, {
			message: 'Только латиница, цифры и _, начинаться с буквы'
		}),
	fieldType: FieldType
})

export const selectMetaSchema = z.object({
	fieldMetadata: z.object({
		allowMultiple: z.boolean().optional().default(false),
		disableSuggestions: z.boolean().optional().default(false),
		options: z
			.array(optionSchema)
			.min(1, { message: 'Добавьте хотя бы одну опцию' })
	})
})

// Relaxed metadata (без min(1) на base-уровне), строгую проверку делаем в superRefine
const relaxedFieldMetadata = z.object({
	allowMultiple: z.boolean().optional().default(false),
	disableSuggestions: z.boolean().optional().default(false),
	options: z.array(optionSchema).optional()
})

export type FieldFormValues = z.input<typeof baseSchema> &
	Partial<z.input<typeof userEditableSchema>> & {
		fieldMetadata?: z.infer<typeof relaxedFieldMetadata>
	}

export function buildFieldFormSchema(params: {
	isSystem: boolean
	initialFieldType: z.infer<typeof FieldType>
}) {
	const { isSystem, initialFieldType } = params
	let schema = baseSchema.extend({
		fieldMetadata: relaxedFieldMetadata.optional()
	})
	if (!isSystem) schema = schema.extend(userEditableSchema.shape)
	return schema.superRefine((v, ctx) => {
		const type = (v as any).fieldType ?? initialFieldType
		if (!isSystem && type === 'SELECT') {
			const fm = (v as any).fieldMetadata
			if (!fm || !Array.isArray(fm.options) || fm.options.length < 1) {
				ctx.addIssue({
					code: 'custom',
					path: ['fieldMetadata', 'options'],
					message: 'Добавьте хотя бы одну опцию'
				})
			} else {
				fm.options.forEach((opt: any, i: number) => {
					if (!opt?.label)
						ctx.addIssue({
							code: 'custom',
							path: ['fieldMetadata', 'options', i, 'label'],
							message: 'Обязательно'
						})
					if (!opt?.value)
						ctx.addIssue({
							code: 'custom',
							path: ['fieldMetadata', 'options', i, 'value'],
							message: 'Обязательно'
						})
				})
			}
		}
	})
}
