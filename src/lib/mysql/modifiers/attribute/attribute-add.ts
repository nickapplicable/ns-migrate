import { AttributeAddAction } from '../../differs/attribute/attribute-add'
import { mapAttributeTypeToMySQLType } from '../../utils'

export const attributeAddQuery = (action: AttributeAddAction) => {
	const { attribute, tableName } = action.data

	const name = attribute.name
	const type = mapAttributeTypeToMySQLType(attribute.type)
	const nullable = attribute.nullable ? 'NULL' : 'NOT NULL'
	const def = type !== 'text' && attribute.default ? `DEFAULT ${attribute.default}` : ''

	return `
		ALTER TABLE \`${tableName}\` ADD COLUMN \`${name}\` ${type} ${nullable} ${def};
	`
}
