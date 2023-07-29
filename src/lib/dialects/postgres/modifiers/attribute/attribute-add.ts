import { AttributeAddAction } from '../../differs/attribute/attribute-add'
import { mapAttributeTypeToPgType } from '../../utils'

export const attributeAddQuery = (action: AttributeAddAction) => {
	const { attribute, tableName } = action.data

	return `
		ALTER TABLE "${tableName}" ADD COLUMN "${
		attribute.name
	}" ${mapAttributeTypeToPgType(attribute.type)} ${
		attribute.nullable ? 'NULL' : 'NOT NULL'
	} ${attribute.default ? `DEFAULT ${attribute.default}` : ''};
	`
}
