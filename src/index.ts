import { Client } from 'pg'
import { Schema } from './lib/types'
import { getDialect } from './lib/dialects'

type Credentials = {
	host: string
	port: number
	database: string
	user: string
	password: string
}

type DBURL = string

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
