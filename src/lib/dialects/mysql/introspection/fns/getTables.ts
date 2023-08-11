import { Connection } from 'mysql2/promise'
import { z } from 'zod'

const validate = z.array(
	z.object({
		name: z.string(),
	})
)

export const getTables = async (db: Connection) => {
	const [rows] = await db.query(`
		SELECT TABLE_NAME as name
		FROM information_schema.TABLES as t
		WHERE t.TABLE_SCHEMA = 'db'
	`)

	return validate.parse(rows)
}
