import type { Model, Schema } from '../../../types'

export type ModelAddAction = {
	type: 'model-add'
	data: {
		model: Model
	}
}

export const diffModelAdd = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: ModelAddAction[] = []

	for (const newModel of newSchema.models) {
		const originalModel = originalSchema.models.find((model) => model.id === newModel.id)

		if (!originalModel) {
			diffs.push({
				type: 'model-add',
				data: {
					model: newModel,
				},
			})
		}
	}

	return diffs
}
