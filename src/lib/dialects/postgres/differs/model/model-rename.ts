import type { Schema } from '../../../../types'

export type ModelRenameAction = {
	type: 'model-rename'
	data: {
		from: string
		to: string
	}
}

export const diffModelRename = (originalSchema: Schema, newSchema: Schema) => {
	const diffs: ModelRenameAction[] = []

	for (const originalModel of originalSchema.models) {
		const newModel = newSchema.models.find(
			(model) => model.id === originalModel.id
		)

		if (newModel) {
			const originalName = originalModel.tableName
			const newName = newModel.tableName

			if (originalName !== newName) {
				diffs.push({
					type: 'model-rename',
					data: {
						from: originalName,
						to: newName,
					},
				})
			}
		}
	}

	return diffs
}
