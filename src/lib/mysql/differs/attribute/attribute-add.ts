import type { Attribute, Schema } from '../../../types'
import { Priority } from '../../utils'

export type AttributeAddAction = {
	type: 'attribute-add'
	priority: number
	data: {
		tableName: string
		attribute: Attribute
	}
}

export const diffAttributeAdd = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: AttributeAddAction[] = []

	for (const newModel of newSchema.models) {
		const originalModel = originalSchema.models.find((model) => model.id === newModel.id)

		// if the model is new, then the whole thing will be new, no need to add a single attr
		if (!originalModel) continue

		for (const newAttribute of newModel.attributes) {
			const originalAttribute = originalModel.attributes.find((attribute) => attribute.id === newAttribute.id)

			if (!originalAttribute) {
				diffs.push({
					type: 'attribute-add',
					priority: Priority.ATTRIBUTE,
					data: {
						tableName: newModel.tableName,
						attribute: newAttribute,
					},
				})
			}
		}
	}

	return diffs
}
