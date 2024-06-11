import type { Schema } from '../../../types'
import { Priority } from '../../utils'

export type ModelRemoveAction = {
	type: 'model-remove'
	priority: number
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
				priority: Priority.MODEL_REMOVE,
				data: {
					tableName: originalModel.tableName,
				},
			})
		}
	}

	return diffs
}
