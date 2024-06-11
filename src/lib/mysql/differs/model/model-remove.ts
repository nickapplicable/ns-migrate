import type { Schema } from '../../../types'

export type ModelRemoveAction = {
	type: 'model-remove'
	data: {
		tableName: string
	}
}

export const diffModelRemove = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: ModelRemoveAction[] = []

	for (const originalModel of originalSchema.models) {
		const newModel = newSchema.models.find((model) => model.id === originalModel.id)

		if (!newModel) {
			diffs.push({
				type: 'model-remove',
				data: {
					tableName: originalModel.tableName,
				},
			})
		}
	}

	return diffs
}
