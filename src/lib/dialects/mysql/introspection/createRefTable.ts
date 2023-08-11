import { Connection } from 'mysql2/promise'

export const createRefTable = async (db: Connection) => {
	await db.query(`
		CREATE TABLE IF NOT EXISTS _ref (
			id uuid not null primary key,
			type text not null,
			name text not null,
			tableName text null
		);
	`)
}
