import type { Schema } from '../../../../types'

export type AttributeRenameAction = {
	type: 'attribute-rename'
	data: {
		tableName: string
		from: string
		to: string
	}
}

export const diffAttributeRename = (
	originalSchema: Schema,
	newSchema: Schema
) => {
	const diffs: AttributeRenameAction[] = []

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

			if (originalAttribute.name !== newAttribute.name) {
				diffs.push({
					type: 'attribute-rename',
					data: {
						tableName: newModel.tableName,
						from: originalAttribute.name,
						to: newAttribute.name,
					},
				})
			}
		}
	}

	return diffs
}
