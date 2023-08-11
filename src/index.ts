import { Client, Pool } from 'pg'
import { createConnection, Connection } from 'mysql2/promise'
import { Schema } from './lib/types'
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
	let client

	if (dialect === 'postgres') {
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

		return await getDialect('postgres').getSchema(client)
	}

	if (dialect === 'mysql') {
		if (isCredentials(credentials)) {
			client = await createConnection(credentials)
		} else {
			client = credentials
		}

		if (!client) return

		return await getDialect('mysql').getSchema(client as Connection)
	}
}

export const migrate = async (
	credentials: Credentials | DBURL,
	schema: Schema,
	force = false
) => {
	// connect to the database
	const client = new Client(credentials)
	await client.connect()

	const d = getDialect('postgres')

	// create the ref table if it doesn't already exist
	await d.createRefTable(client)

	// introspect the database and create a schema object
	const dbSchema = await d.getSchema(client)

	// console.dir(dbSchema, { depth: 4, colors: true })

	// compare the db schema with the incoming schema, and get the sync queries
	const queries = d.getQueries(dbSchema, schema, force)

	// console log each of the sync queries
	for (const query of queries) {
		console.log(query)
		console.log(' ')
		await client.query(query)
	}

	await d.updateRefs(client, schema)

	await client.end()
}
