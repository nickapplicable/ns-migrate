import { QueryFn, RelationType, Schema } from '../../../types'
import { createRefTable } from './createRefTable'

export const updateRefs = async (query: QueryFn, schema: Schema) => {
	await createRefTable(query)

	for (const model of schema.models) {
		await query(`
			INSERT INTO dynamo.ref (id, type, name)
			VALUES('${model.id}', 'm', '${model.tableName}')
			ON CONFLICT (id) DO UPDATE SET name = '${model.tableName}'
		`)

		for (const attr of model.attributes) {
			await query(`
				insert into dynamo.ref (id, type, name, tableName)
				VALUES('${attr.id}', 'a', '${attr.name}', '${model.tableName}')
				ON CONFLICT (id) DO UPDATE SET name = '${attr.name}'
			`)
		}

		const sourceRelations = schema.relations.filter(
			(relation) =>
				relation.sourceId === model.id &&
				relation.type === RelationType.manyToOne
		)

		for (const relation of sourceRelations) {
			await query(`
				insert into dynamo.ref (id, type, name, tableName)
				VALUES('${relation.id}', 'r', '${relation.targetName}Id', '${model.tableName}')
				ON CONFLICT (id) DO UPDATE SET name = '${relation.targetName}Id'
			`)
		}

		const targetRelations = schema.relations.filter(
			(relation) =>
				relation.targetId === model.id &&
				(relation.type === RelationType.oneToMany ||
					relation.type === RelationType.oneToOne)
		)

		for (const relation of targetRelations) {
			await query(`
				insert into dynamo.ref (id, type, name, tableName)
				VALUES('${relation.id}', 'r', '${relation.sourceName}Id', '${model.tableName}')
				ON CONFLICT (id) DO UPDATE SET name = '${relation.sourceName}Id'
			`)
		}
	}
}
