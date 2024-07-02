import { AttributeAddAction } from '../../differs/attribute/attribute-add'
import { mapAttributeTypeToMySQLType } from '../../utils'

export const attributeAddQuery = (action: AttributeAddAction) => {
	const { tableName, attribute, prevAttribute } = action.data

	const name = attribute.name
	const type = mapAttributeTypeToMySQLType(attribute.type)
	const nullable = attribute.nullable ? 'NULL' : 'NOT NULL'
	const def = type !== 'text' && attribute.default ? `DEFAULT ${attribute.default}` : ''
	const suffix = prevAttribute ? `AFTER \`${prevAttribute.name}\`` : 'FIRST'

	return `
		ALTER TABLE \`${tableName}\` ADD COLUMN \`${name}\` ${type} ${nullable} ${def} ${suffix};
	`
}
