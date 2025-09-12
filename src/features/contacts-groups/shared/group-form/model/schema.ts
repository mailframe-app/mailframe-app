import { z } from 'zod'

export const GroupFormSchema = z.object({
	name: z.string().trim().min(1, { message: 'Укажите название группы' }),
	description: z.string().trim().optional()
})

export type GroupFormValues = z.input<typeof GroupFormSchema>
