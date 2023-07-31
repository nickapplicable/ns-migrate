import { Client, Pool } from 'pg'
import { z } from 'zod'

const validate = z.array(
	z.object({
		name: z.string(),
		table: z.string(),
		type: z.string(),
		notnull: z.boolean(),
	})
)

export const getColumns = async (db: Client | Pool) => {
	const { rows } = await db.query(`
		SELECT a.attname AS name, c.relname as table, t.typname as type, a.attnotnull as notnull
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
