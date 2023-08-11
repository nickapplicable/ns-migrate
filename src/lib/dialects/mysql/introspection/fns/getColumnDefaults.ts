import { z } from 'zod'
import { QueryFn } from '../../../../types'

const validate = z.array(
	z.object({
		tableName: z.string(),
		column: z.string(),
		value: z.string().nullable(),
	})
)

export const getColumnDefaults = async (query: QueryFn) => {
	const rows = await query(`
		SELECT TABLE_NAME as tableName, COLUMN_NAME as column, COLUMN_DEFAULT as value
		FROM information_schema.COLUMNS
		WHERE TABLE_SCHEMA = 'db'
	`)
	return validate.parse(rows)
}
