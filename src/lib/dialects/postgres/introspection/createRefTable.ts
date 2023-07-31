import { Client, Pool } from 'pg'

export const createRefTable = async (db: Client | Pool) => {
	await db.query(`CREATE SCHEMA IF NOT EXISTS dynamo`)
	await db.query(`
		CREATE TABLE IF NOT EXISTS dynamo.ref (
			id uuid not null primary key,
			type text not null,
			name text not null,
			tableName text null
		);
	`)
}
