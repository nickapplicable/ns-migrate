import { z } from 'zod'
import { QueryFn } from '../../../types'

const validate = z.array(
	z.object({
		tableName: z.string(),
		columnName: z.string(),
		defaultValue: z.string().nullable(),
	})
)

export const getColumnDefaults = async (query: QueryFn, dbName: string) => {
	const rows = await query(`
		SELECT TABLE_NAME as tableName, COLUMN_NAME as columnName, COLUMN_DEFAULT as defaultValue
		FROM information_schema.COLUMNS
		WHERE TABLE_SCHEMA = '${dbName}'
	`)
	return validate.parse(
		rows.map((row: Record<string, string>) => ({
			...row,
			defaultValue: row.defaultValue,
		}))
	)
}
