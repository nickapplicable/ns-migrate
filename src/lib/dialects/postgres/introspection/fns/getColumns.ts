import { z } from 'zod'
import { QueryFn } from '../../../../types'

const validate = z.array(
	z.object({
		name: z.string(),
		tableName: z.string(),
		type: z.string(),
		notnull: z.boolean(),
	})
)

export const getColumns = async (query: QueryFn) => {
	const rows = await query(`
		SELECT a.attname AS name, c.relname as tableName, t.typname as type, a.attnotnull as notnull
		FROM pg_attribute a
		INNER JOIN pg_class c ON a.attrelid = c.oid
		INNER JOIN pg_namespace n ON c.relnamespace = n.oid
		INNER JOIN pg_type t ON a.atttypid = t.oid
		WHERE n.nspname = 'public'
		AND a.attrelid = c.oid
		AND a.attnum > 0
		ORDER BY a.attnum;
	`)

	return validate.parse(rows)
}
