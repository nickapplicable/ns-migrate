import type { Schema } from '../../../types'
import { mapAttributeTypeToMySQLType, Priority } from '../../utils'

export type AttributeChangeTypeAction = {
	type: 'attribute-change-type'
	priority: number
	data: {
		tableName: string
		attributeName: string
		from: string
		to: string
		optional: boolean
		autoIncrement: boolean
	}
}

export const diffAttributeChangeType = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: AttributeChangeTypeAction[] = []

	for (const originalModel of originalSchema.models) {
		const newModel = newSchema.models.find((model) => model.id === originalModel.id)

		// if the new model is gone, then the whole thing will be going, no need to remove a single attr
		if (!newModel) continue

		for (const originalAttribute of originalModel.attributes) {
			const newAttribute = newModel.attributes.find((attribute) => attribute.id === originalAttribute.id)

			// if the attr is gone, it can't be renamed
			if (!newAttribute) continue

			const originalType = mapAttributeTypeToMySQLType(originalAttribute.type)
			const newType = mapAttributeTypeToMySQLType(newAttribute.type)

			const originalAutoIncrement = originalAttribute.type === 'a_i'
			const newAutoIncrement = newAttribute.type === 'a_i'

			if (
				originalType !== newType ||
				originalAttribute.nullable !== newAttribute.nullable ||
				originalAutoIncrement !== newAutoIncrement
			) {
				diffs.push({
					type: 'attribute-change-type',
					priority: Priority.ATTRIBUTE,
					data: {
						tableName: newModel.tableName,
						attributeName: newAttribute.name,
						from: originalType,
						to: newType,
						optional: newAutoIncrement ? false : newAttribute.nullable,
						autoIncrement: newAutoIncrement,
					},
				})
			}
		}
	}

	return diffs
}
