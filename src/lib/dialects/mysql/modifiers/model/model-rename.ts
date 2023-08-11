import { ModelRenameAction } from '../../differs/model/model-rename'

export const modelRenameQuery = (action: ModelRenameAction) => {
	const { from, to } = action.data

	return `ALTER TABLE ${from} RENAME TO ${to};`
}
