import { Connection } from 'mysql2/promise'
import { z } from 'zod'

const validate = z.array(
	z.object({
		name: z.string(),
		table: z.string(),
		type: z.string(),
		notnull: z.boolean(),
	})
)

export const getColumns = async (db: Connection) => {
	const [rows] = await db.query(`
		SELECT COLUMN_NAME as name, TABLE_NAME as tableName, COLUMN_TYPE as type, IS_NULLABLE as notnull
		FROM information_schema.COLUMNS
		WHERE TABLE_SCHEMA = 'db'
	`)

	return validate.parse(
		(rows as any[]).map((row) => ({
			...row,
			notnull: row.notnull === 'NO',
		}))
	)
}
