import { Client, Pool } from 'pg'
import { createConnection, Connection } from 'mysql2/promise'
import { QueryFn, Schema } from './lib/types'
import { Dialect, getDialect } from './lib/dialects'

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
		(typeof credentials.port === 'number' ||
			typeof credentials.port === 'undefined') &&
		typeof credentials.database === 'string' &&
		typeof credentials.user === 'string' &&
		typeof credentials.password === 'string'
	)
}

type DBURL = string

export const getSchema = async (
	dialect: Dialect,
	credentials: Credentials | Client | Pool | Connection
) => {
	if (dialect === 'postgres') {
		let client = credentials

		if (isCredentials(credentials)) {
			client = new Client(credentials)
			await client.connect()
		} else if (
			credentials instanceof Client ||
			credentials instanceof Pool
		) {
			client = credentials
		}

		if (!client) return

		const query = async (sql: string) => {
			const { rows } = await (client as Client | Pool).query(sql)
			return rows
		}

		return await getDialect('postgres').getSchema(query)
	}

	if (dialect === 'mysql') {
		let client = credentials

		if (isCredentials(credentials)) {
			client = await createConnection(credentials)
		} else {
			client = credentials
		}

		if (!client) return

		const query = async (sql: string) => {
			const [rows] = await (client as Connection).query(sql)
			return rows
		}

		return await getDialect('mysql').getSchema(query)
	}
}

export const migrate = async (
	dialect: Dialect,
	credentials: Credentials | DBURL,
	schema: Schema,
	force = false
) => {
	let client: Client | Pool | Connection | null = null
	let query: QueryFn | null = null

	if (dialect === 'postgres') {
		client = new Client(credentials)
		await client.connect()

		query = async (sql: string) => {
			const { rows } = await (client as Client | Pool).query(sql)
			return rows
		}
	}

	if (dialect === 'mysql') {
		client = await createConnection(
			isCredentials(credentials)
				? credentials
				: { uri: credentials as DBURL }
		)

		query = async (sql: string) => {
			const [rows] = await (client as Connection).query(sql)
			return rows
		}
	}

	if (!query) return

	// connect to the database

	const d = getDialect(dialect)

	// create the ref table if it doesn't already exist
	await d.createRefTable(query)

	// introspect the database and create a schema object
	const dbSchema = await d.getSchema(query)

	// console.dir(dbSchema, { depth: 4, colors: true })

	// compare the db schema with the incoming schema, and get the sync queries
	const queries = d.getQueries(dbSchema, schema, force)

	// console log each of the sync queries
	for (const sql of queries) {
		console.log(sql)
		console.log(' ')
		await query(sql)
	}

	await d.updateRefs(query, schema)

	if (dialect === 'postgres') {
		await (client as Client | Pool).end()
	} else {
		await (client as Connection).end()
	}
}
