import type { Schema } from '../../../types'
import { Priority } from '../../utils'

export type AttributeRemoveAction = {
	type: 'attribute-remove'
	priority: number
	data: {
		tableName: string
		attributeName: string
	}
}

export const diffAttributeRemove = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: AttributeRemoveAction[] = []

	for (const originalModel of originalSchema.models) {
		const newModel = newSchema.models.find((model) => model.id === originalModel.id)

		// if the new model is gone, then the whole thing will be going, no need to remove a single attr
		if (!newModel) continue

		for (const originalAttribute of originalModel.attributes) {
			const newAttribute = newModel.attributes.find((attribute) => attribute.id === originalAttribute.id)

			if (!newAttribute) {
				diffs.push({
					type: 'attribute-remove',
					priority: Priority.ATTRIBUTE_REMOVE,
					data: {
						tableName: newModel.tableName,
						attributeName: originalAttribute.name,
					},
				})
			}
		}
	}

	return diffs
}
