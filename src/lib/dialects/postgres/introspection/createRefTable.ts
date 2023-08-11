import { QueryFn } from '../../../types'

export const createRefTable = async (query: QueryFn) => {
	await query(`CREATE SCHEMA IF NOT EXISTS dynamo`)
	await query(`
		CREATE TABLE IF NOT EXISTS dynamo.ref (
			id uuid not null primary key,
			type text not null,
			name text not null,
			tableName text null
		);
	`)
}
