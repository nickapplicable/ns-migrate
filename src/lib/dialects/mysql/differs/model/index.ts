import { Schema } from '../../../../types'
import { type ModelAddAction, diffModelAdd } from './model-add'
import { type ModelRemoveAction, diffModelRemove } from './model-remove'
import { type ModelRenameAction, diffModelRename } from './model-rename'

export type DiffModelAction =
	| ModelAddAction
	| ModelRemoveAction
	| ModelRenameAction

export const diffModels = (originalSchema: Schema, newSchema: Schema) => {
	return [
		...diffModelRemove(originalSchema, newSchema),
		...diffModelAdd(originalSchema, newSchema),
		...diffModelRename(originalSchema, newSchema),
	]
}
