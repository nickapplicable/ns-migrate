import { RelationRemoveAction } from '../../differs/relation/relation-remove'

export const relationRemoveQuery = (action: RelationRemoveAction) => {
	const { fromTable, name } = action.data

	return `
		ALTER TABLE \`${fromTable}\`
		DROP FOREIGN KEY \`${name}\`
	`
}
