import { AttributeChangeNullableAction } from '../../differs/attribute/attribute-change-nullable'

export const attributeChangeNullableQuery = (
	action: AttributeChangeNullableAction
) => {
	const { tableName, attributeName, to } = action.data

	const change = to ? 'DROP' : 'SET'

	return `ALTER TABLE "${tableName}" ALTER COLUMN "${attributeName}" ${change} NOT NULL;`
}
