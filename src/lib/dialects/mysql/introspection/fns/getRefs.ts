import { z } from 'zod'
import { QueryFn } from '../../../../types'

const validate = z.array(
	z.object({
		id: z.string(),
		type: z.enum(['m', 'a', 'r']), // m = model, a = attribute, r = relation
		name: z.string(),
		tableName: z.string().nullable(),
		posX: z.number().nullable(),
		posY: z.number().nullable(),
		relationType: z.string().nullable(),
	})
)

export const getRefs = async (query: QueryFn) => {
	const rows = await query(`SELECT * FROM _ref`)
	return validate.parse(rows)
}
