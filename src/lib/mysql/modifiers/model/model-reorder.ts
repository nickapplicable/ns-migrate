import { ModelReorderAction } from '../../differs/model/model-reorder'
import { mapAttributeTypeToMySQLType } from '../../utils'

export const modelReorderQuery = (action: ModelReorderAction) => {
	const { model } = action.data

	return `
		ALTER TABLE \`${model.tableName}\`
			${[...model.attributes]
				.sort((a, b) => (a.order || 0) - (b.order || 0))
				.map((attribute, index) => {
					const name = attribute.name
					const type = mapAttributeTypeToMySQLType(attribute.type)
					const nullable = attribute.nullable ? 'NULL' : 'NOT NULL'
					const def = type !== 'text' && attribute.default ? `DEFAULT ${attribute.default}` : ''
					const ai = attribute.type === 'a_i' ? 'AUTO_INCREMENT UNIQUE' : ''

					const order = index === 0 ? 'FIRST' : `AFTER \`${model.attributes[index - 1]!.name}\``

					return `CHANGE \`${name}\` \`${name}\` ${type} ${nullable} ${ai} ${def} ${order}`
				})
				.join(',')};
	`
}
