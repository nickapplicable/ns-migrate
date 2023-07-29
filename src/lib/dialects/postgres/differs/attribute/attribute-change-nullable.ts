import type { Schema } from '../../../../types'

export type AttributeChangeNullableAction = {
	type: 'attribute-change-nullable'
	data: {
		tableName: string
		attributeName: string
		to: boolean
	}
}

export const diffAttributeChangeNullable = (
	originalSchema: Schema,
	newSchema: Schema
) => {
	const diffs: AttributeChangeNullableAction[] = []

	for (const originalModel of originalSchema.models) {
		const newModel = newSchema.models.find(
			(model) => model.id === originalModel.id
		)

		// if the new model is gone, then the whole thing will be going, no need to remove a single attr
		if (!newModel) continue

		for (const originalAttribute of originalModel.attributes) {
			const newAttribute = newModel.attributes.find(
				(attribute) => attribute.id === originalAttribute.id
			)

			// if the attr is gone, it can't be renamed
			if (!newAttribute) continue

			if (originalAttribute.nullable !== newAttribute.nullable) {
				diffs.push({
					type: 'attribute-change-nullable',
					data: {
						tableName: newModel.tableName,
						attributeName: newAttribute.name,
						to: newAttribute.nullable,
					},
				})
			}
		}
	}

	return diffs
}
