import { AttributeChangeDefaultAction } from '../../differs/attribute/attribute-change-default'

export const attributeChangeDefaultQuery = (action: AttributeChangeDefaultAction) => {
	const { tableName, attributeName, to } = action.data

	const def = to === null || to?.toLowerCase() === 'null' ? 'NULL' : `${to}`

	return `ALTER TABLE \`${tableName}\` ALTER COLUMN \`${attributeName}\` SET DEFAULT ${def};`
}
