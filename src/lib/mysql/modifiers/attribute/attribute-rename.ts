import { AttributeRenameAction } from '../../differs/attribute/attribute-rename'

export const attributeRenameQuery = (action: AttributeRenameAction) => {
	const { tableName, from, to } = action.data

	return `ALTER TABLE \`${tableName}\` RENAME COLUMN \`${from}\` TO \`${to}\`;`
}
