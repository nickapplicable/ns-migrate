import { AttributeChangeTypeAction } from '../../differs/attribute/attribute-change-type'

export const attributeChangeTypeQuery = (action: AttributeChangeTypeAction) => {
	const { tableName, attributeName, to, optional } = action.data

	const nullable = optional ? 'NULL' : 'NOT NULL'

	return `ALTER TABLE \`${tableName}\` MODIFY \`${attributeName}\` ${to} ${nullable};`
}
