import { RelationAddAction } from '../../differs/relation/relation-add'
import { mapAttributeTypeToMySQLType } from '../../utils'

export const relationAddQuery = (action: RelationAddAction) => {
	const { fromTable, toTable, column } = action.data

	return `
		ALTER TABLE \`${fromTable}\`
		ADD FOREIGN KEY (\`${column}\`) REFERENCES \`${toTable}\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
	`
}
