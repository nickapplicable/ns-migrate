import { AttributeRemoveAction } from '../../differs/attribute/attribute-remove'

export const attributeRemoveQuery = (action: AttributeRemoveAction) => {
	const { tableName, attributeName } = action.data

	return `ALTER TABLE \`${tableName}\` DROP COLUMN \`${attributeName}\`;`
}
