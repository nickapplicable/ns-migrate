import type { Schema } from '../../../types'

export type RelationRemoveAction = {
	type: 'relation-remove'
	data: {
		name: string
		fromTable: string
		toTable: string
		column: string
	}
}

export const diffRelationRemove = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: RelationRemoveAction[] = []

	for (const originalRelation of originalSchema.relations) {
		const newRelation = newSchema.relations.find((relation) => {
			return (
				relation.id === originalRelation.id &&
				relation.targetId === originalRelation.targetId &&
				relation.sourceId === originalRelation.sourceId
			)
		})

		if (!newRelation) {
			const fromModelId =
				originalRelation.type === 'oneToMany' ? originalRelation.targetId : originalRelation.sourceId
			const fromModel = newSchema.models.find((model) => model.id === fromModelId)
			if (!fromModel) return []
			const fromTable = fromModel?.tableName

			const toModelId =
				originalRelation.type === 'oneToMany' ? originalRelation.sourceId : originalRelation.targetId
			const toModel = newSchema.models.find((model) => model.id === toModelId)
			if (!toModel) return []
			const toTable = toModel?.tableName

			const column = `${
				originalRelation.type === 'oneToMany' ? originalRelation.sourceName : originalRelation.targetName
			}Id`

			diffs.push({
				type: 'relation-remove',
				data: {
					name: originalRelation.id,
					fromTable,
					toTable,
					column,
				},
			})
		}
	}

	return diffs
}
