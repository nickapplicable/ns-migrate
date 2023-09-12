import { RelationRemoveAction } from '../../differs/relation/relation-remove'

export const relationRemoveQuery = (action: RelationRemoveAction) => {
	const { relation } = action.data

	// return `DROP TABLE \`${tableName}\`;`
	return ''
}
