import { z } from 'zod'
import { QueryFn } from '../../../../types'

const validate = z.array(
	z.object({
		name: z.string(),
	})
)

export const getTables = async (query: QueryFn) => {
	const { rows } = await query(`
		SELECT c.relname as name
		FROM pg_class c
		INNER JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE c.relkind = 'r'
		AND n.nspname = 'public'
	`)

	return validate.parse(rows)
}
