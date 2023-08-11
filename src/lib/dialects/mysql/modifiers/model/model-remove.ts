import { ModelRemoveAction } from '../../differs/model/model-remove'

export const modelRemoveQuery = (action: ModelRemoveAction) => {
	const { tableName } = action.data

	return `DROP TABLE "${tableName}";`
}
