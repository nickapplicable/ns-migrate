import { QueryFn, RelationType, Schema } from '../../types'
import { createRefTable } from './createRefTable'

export const updateRefs = async (query: QueryFn, schema: Schema) => {
	await createRefTable(query)

	for (const model of schema.models) {
		await query(`
			INSERT INTO _ref (id, type, name, posX, posY)
			VALUES('${model.id}', 'm', '${model.tableName}', ${model.posX}, ${model.posY})
			ON DUPLICATE KEY UPDATE
				id = '${model.id}',
				type = 'm',
				name = '${model.tableName}',
				posX = ${model.posX},
				posY = ${model.posY}
		`)

		for (const attr of model.attributes) {
			await query(`
				INSERT INTO _ref (id, type, name, tableName)
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
				(relation.type === RelationType.manyToOne || relation.type === RelationType.oneToOne)
		)

		for (const relation of sourceRelations) {
			await query(`
				INSERT INTO _ref (id, type, name, tableName, relationType)
				VALUES('${relation.id}', 'r', '${relation.targetName}Id', '${model.tableName}', '${relation.type}')
				ON DUPLICATE KEY UPDATE
					id = '${relation.id}',
					type = 'r',
					name = '${relation.targetName}Id',
					tableName = '${model.tableName}',
					relationType = '${relation.type}'
			`)
		}

		const targetRelations = schema.relations.filter(
			(relation) => relation.targetId === model.id && relation.type === RelationType.oneToMany
		)

		for (const relation of targetRelations) {
			await query(`
				INSERT INTO _ref (id, type, name, tableName, relationType)
				VALUES('${relation.id}', 'r', '${relation.sourceName}Id', '${model.tableName}', '${relation.type}')
				ON DUPLICATE KEY UPDATE
					id = '${relation.id}',
					type = 'r',
					name = '${relation.sourceName}Id',
					tableName = '${model.tableName}',
					relationType = '${relation.type}'
			`)
		}
	}
}
