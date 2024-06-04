import { createConnection, Connection } from 'mysql2/promise'
import { Schema } from './lib/types'
import mysql from './lib/mysql'

type Credentials = {
	host: string
	port?: number
	database: string
	user: string
	password: string
}

const isCredentials = (credentials: any): credentials is Credentials => {
	return (
		typeof credentials === 'object' &&
		typeof credentials.host === 'string' &&
		(typeof credentials.port === 'number' || typeof credentials.port === 'undefined') &&
		typeof credentials.database === 'string' &&
		typeof credentials.user === 'string' &&
		typeof credentials.password === 'string'
	)
}

type DBURL = string

export const getSchema = async (credentials: Credentials | Connection, dbName: string) => {
	const client: Connection = await (async () =>
		isCredentials(credentials) ? await createConnection(credentials) : credentials)()

	return mysql.getSchema(async (sql: string) => {
		const [rows] = await client.query(sql)
		return rows
	}, dbName)
}

export const LogLevel = {
	none: 0,
	log: 1,
	deep: 2,
} as const

type Options = {
	force?: boolean
	log?: (typeof LogLevel)[keyof typeof LogLevel]
	debug?: boolean
}

export const migrate = async (credentials: Credentials | DBURL, schema: Schema, options: Options) => {
	const { force = false, log = LogLevel.none, debug = false } = options
	// const force: boolean = true
	// const debug: boolean = false
	// const log: number = 1

	const client = await createConnection(isCredentials(credentials) ? credentials : { uri: credentials as DBURL })

	const query = async (sql: string) => {
		if (log === LogLevel.deep) {
			console.log(sql)
			console.log(' ')
		}
		const [rows] = await client.query(sql)
		return rows
	}

	const dbName = isCredentials(credentials) ? credentials.database : credentials.split('/').pop()
	if (!dbName) return

	// create the ref table if it doesn't already exist
	await mysql.createRefTable(query)

	// introspect the database and create a schema object
	const dbSchema = await mysql.getSchema(query, dbName)

	// compare the db schema with the incoming schema, and get the sync queries
	const queries = mysql.getQueries(dbSchema, schema, force)

	// console log each of the sync queries
	for (const sql of queries) {
		if (log === LogLevel.log) {
			console.log(sql)
			console.log(' ')
		}

		if (!debug) await query(sql)
	}

	if (!debug) await mysql.updateRefs(query, schema)

	await client.end()
}
