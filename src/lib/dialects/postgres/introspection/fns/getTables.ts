import { Client } from 'pg'
import { z } from 'zod'

const validate = z.array(
	z.object({
		name: z.string(),
	})
)

export const getTables = async (db: Client) => {
	const { rows } = await db.query(`
		SELECT c.relname as name
		FROM pg_class c
		INNER JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE c.relkind = 'r'
		AND n.nspname = 'public'
	`)

	return validate.parse(rows)
}
