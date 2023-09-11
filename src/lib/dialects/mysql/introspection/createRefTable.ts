import { QueryFn } from '../../../types'

export const createRefTable = async (query: QueryFn) => {
	await query(`
		CREATE TABLE IF NOT EXISTS _ref (
			id varchar(36) not null primary key,
			type text not null,
			name text not null,
			tableName text null,
			posX float null,
			posY float null
		);
	`)
}
