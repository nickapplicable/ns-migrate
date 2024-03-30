import type { Relation, Schema } from '../../../types'

export type RelationAddAction = {
	type: 'relation-add'
	data: {
		fromTable: string
		toTable: string
		column: string
	}
}

export const diffRelationAdd = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: RelationAddAction[] = []

	for (const newRelation of newSchema.relations) {
		const originalRelation = originalSchema.relations.find((relation) => relation.id === newRelation.id)

		if (!originalRelation) {
			const fromModelId = newRelation.type === 'oneToMany' ? newRelation.targetId : newRelation.sourceId
			const fromModel = newSchema.models.find((model) => model.id === fromModelId)
			if (!fromModel) return []
			const fromTable = fromModel?.tableName

			const toModelId = newRelation.type === 'oneToMany' ? newRelation.sourceId : newRelation.targetId
			const toModel = newSchema.models.find((model) => model.id === toModelId)
			if (!toModel) return []
			const toTable = toModel?.tableName

			const column = `${newRelation.type === 'oneToMany' ? newRelation.sourceName : newRelation.targetName}Id`

			diffs.push({
				type: 'relation-add',
				data: {
					fromTable,
					toTable,
					column,
				},
			})
		}
	}

	return diffs
}
