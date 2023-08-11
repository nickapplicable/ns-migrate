import { AttributeAddAction } from '../../differs/attribute/attribute-add'
import { mapAttributeTypeToMySQLType } from '../../utils'

export const attributeAddQuery = (action: AttributeAddAction) => {
	const { attribute, tableName } = action.data

	return `
		ALTER TABLE \`${tableName}\` ADD COLUMN \`${
		attribute.name
	}\` ${mapAttributeTypeToMySQLType(attribute.type)} ${
		attribute.nullable ? 'NULL' : 'NOT NULL'
	} ${attribute.default ? `DEFAULT ${attribute.default}` : ''};
	`
}
