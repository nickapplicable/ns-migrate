import { QueryFn, RelationType, Schema } from '../../../types'
import { createRefTable } from './createRefTable'

export const updateRefs = async (query: QueryFn, schema: Schema) => {
	await createRefTable(query)

	for (const model of schema.models) {
		await query(`
			INSERT INTO _ref (id, type, name)
			VALUES('${model.id}', 'm', '${model.tableName}')
			ON DUPLICATE KEY UPDATE
				id = '${model.id}',
				type = 'm',
				name = '${model.tableName}'
		`)

		for (const attr of model.attributes) {
			await query(`
				insert into _ref (id, type, name, tableName)
				VALUES('${attr.id}', 'a', '${attr.name}', '${model.tableName}')
				ON DUPLICATE KEY UPDATE
					id = '${attr.id}',
					type = 'a',
					name = '${attr.name}',
					tableName = '${model.tableName}'
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
				ON DUPLICATE KEY UPDATE
					id = '${relation.id}',
					type = 'r',
					name = '${relation.targetName}Id',
					tableName = '${model.tableName}'
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
				ON DUPLICATE KEY UPDATE
					id = '${relation.id}',
					type = 'r',
					name = '${relation.sourceName}Id',
					tableName = '${model.tableName}'
			`)
		}
	}
}
