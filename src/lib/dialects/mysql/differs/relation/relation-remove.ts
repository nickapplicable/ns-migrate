import type { Relation, Schema } from '../../../../types'

export type RelationRemoveAction = {
	type: 'relation-remove'
	data: {
		relation: Relation
	}
}

export const diffRelationRemove = (
	originalSchema: Schema,
	newSchema: Schema
) => {
	const diffs: RelationRemoveAction[] = []

	for (const originalRelation of originalSchema.relations) {
		const newRelation = newSchema.relations.find(
			(relation) => relation.id === originalRelation.id
		)

		if (!newRelation) {
			diffs.push({
				type: 'relation-remove',
				data: {
					relation: originalRelation,
				},
			})
		}
	}

	return diffs
}
