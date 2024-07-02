import type { Schema, Model } from '../../../types'

export type ModelReorderAction = {
	type: 'model-reorder'
	data: {
		model: Model
	}
}

export const diffModelReorder = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: ModelReorderAction[] = []

	for (const originalModel of originalSchema.models) {
		const newModel = newSchema.models.find((model) => model.id === originalModel.id)

		if (newModel) {
			let inOrder = true

			const originalAttrsOrdered = originalModel.attributes.sort((a, b) => a.order - b.order)
			const newAttrsOrdered = newModel.attributes.sort((a, b) => a.order - b.order)

			for (let i = 0; i < originalAttrsOrdered.length; i++) {
				if (originalAttrsOrdered[i]?.name !== newAttrsOrdered[i]?.name) {
					inOrder = false
					break
				}
			}

			if (!inOrder) {
				diffs.push({
					type: 'model-reorder',
					data: {
						model: newModel,
					},
				})
			}
		}
	}

	return diffs
}
