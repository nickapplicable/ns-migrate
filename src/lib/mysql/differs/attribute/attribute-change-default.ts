import { AttributeType, type Schema } from '../../../types'

export type AttributeChangeDefaultAction = {
	type: 'attribute-change-default'
	data: {
		tableName: string
		attributeName: string
		to: string | null | undefined
	}
}

export const diffAttributeChangeDefault = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: AttributeChangeDefaultAction[] = []

	for (const originalModel of originalSchema.models) {
		const newModel = newSchema.models.find((model) => model.id === originalModel.id)

		// if the new model is gone, then the whole thing will be going, no need to remove a single attr
		if (!newModel) continue

		for (const originalAttribute of originalModel.attributes) {
			const newAttribute = newModel.attributes.find((attribute) => attribute.id === originalAttribute.id)

			// if the attr is gone, it can't be renamed
			if (!newAttribute) {
				continue
			}

			// can't set defaults on text columns
			if (newAttribute.type.toLowerCase() === 'text') {
				continue
			}

			if (originalAttribute.default === 'NULL' && newAttribute.default === null) {
				continue
			}

			if (originalAttribute.default === 'current_timestamp()' && newAttribute.default === 'CURRENT_TIMESTAMP') {
				continue
			}

			if (originalAttribute.type === AttributeType.boolean && newAttribute.type === AttributeType.boolean) {
				if (originalAttribute.default === '0' && newAttribute.default === 'false') {
					continue
				}

				if (originalAttribute.default === '1' && newAttribute.default === 'true') {
					continue
				}
			}

			if (originalAttribute.default !== newAttribute.default) {
				diffs.push({
					type: 'attribute-change-default',
					data: {
						tableName: newModel.tableName,
						attributeName: newAttribute.name,
						to: newAttribute.default,
					},
				})
			}
		}
	}

	return diffs
}
