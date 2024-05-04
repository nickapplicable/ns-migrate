import { z } from 'zod'
import { QueryFn } from '../../../types'

const validate = z.array(
	z.object({
		name: z.string(),
	})
)

export const getTables = async (query: QueryFn, dbName: string) => {
	const rows = await query(`
		SELECT TABLE_NAME as name
		FROM information_schema.TABLES as t
		WHERE t.TABLE_SCHEMA = '${dbName}'
	`)

	return validate.parse(rows)
}
