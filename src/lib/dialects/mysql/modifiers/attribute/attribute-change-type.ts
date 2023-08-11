import { AttributeChangeTypeAction } from '../../differs/attribute/attribute-change-type'

export const attributeChangeTypeQuery = (action: AttributeChangeTypeAction) => {
	const { tableName, attributeName, to } = action.data

	return `ALTER TABLE ${tableName} ALTER COLUMN ${attributeName} TYPE ${to};`
}
