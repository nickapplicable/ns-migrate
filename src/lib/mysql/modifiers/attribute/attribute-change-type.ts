import { AttributeChangeTypeAction } from '../../differs/attribute/attribute-change-type'

export const attributeChangeTypeQuery = (action: AttributeChangeTypeAction) => {
	const { tableName, attributeName, to, optional } = action.data

	const nullable = optional ? 'NULL' : 'NOT NULL'
	const autoIncrement = action.data.autoIncrement ? 'AUTO_INCREMENT UNIQUE' : ''

	return `ALTER TABLE \`${tableName}\` MODIFY \`${attributeName}\` ${to} ${nullable} ${autoIncrement};`
}
