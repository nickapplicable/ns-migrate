import { Connection } from 'mysql2/promise'
import { z } from 'zod'

const validate = z.array(
	z.object({
		id: z.string(),
		type: z.enum(['m', 'a', 'r']), // m = model, a = attribute, r = relation
		name: z.string(),
		tablename: z.string().nullable(),
	})
)

export const getIds = async (db: Connection) => {
	const [rows] = await db.query(`SELECT * FROM _ref`)
	return validate.parse(rows)
}
