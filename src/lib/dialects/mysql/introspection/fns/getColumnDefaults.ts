import { Connection } from 'mysql2/promise'
import { z } from 'zod'

const validate = z.array(
	z.object({
		tableName: z.string(),
		column: z.string(),
		value: z.string().nullable(),
	})
)

export const getColumnDefaults = async (db: Connection) => {
	const [rows] = await db.query(`
		SELECT TABLE_NAME as tableName, COLUMN_NAME as column, COLUMN_DEFAULT as value
		FROM information_schema.COLUMNS
		WHERE TABLE_SCHEMA = 'db'
	`)
	return validate.parse(rows)
}
