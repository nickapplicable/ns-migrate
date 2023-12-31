import { z } from 'zod'
import { QueryFn } from '../../../../types'

const validate = z.array(
	z.object({
		tableName: z.string(),
		columnName: z.string(),
		defaultValue: z.string().nullable(),
	})
)

export const getColumnDefaults = async (query: QueryFn) => {
	const rows = await query(`
		SELECT c.relname AS tableName, a.attname AS columnName, pg_get_expr(d.adbin, d.adrelid) AS defaultValue
		FROM pg_class c, pg_namespace n, pg_attrdef d, pg_attribute a
		WHERE c.relkind='r'
		AND c.relnamespace=n.oid
		AND n.nspname = 'public'
		AND d.adrelid = c.oid
		AND a.attnum = d.adnum
		AND a.attrelid = c.oid
	`)
	return validate
		.parse(rows)
		.map((x) => ({ ...x, value: x.defaultValue?.replace('public.', '') }))
}
