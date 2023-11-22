import { z } from 'zod'
import { QueryFn } from '../../../../types'

const validate = z.array(
	z.object({
		id: z.string(),
		type: z.enum(['m', 'a', 'r']), // m = model, a = attribute, r = relation
		name: z.string(),
		tablename: z.string().nullable(),
	})
)

export const getIds = async (query: QueryFn) => {
	const { rows } = await query(`SELECT * FROM dynamo.ref`)
	return validate.parse(rows)
}
