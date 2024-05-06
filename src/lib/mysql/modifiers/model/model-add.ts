import { ModelAddAction } from '../../differs/model/model-add'
import { mapAttributeTypeToMySQLType } from '../../utils'

export const modelAddQuery = (action: ModelAddAction) => {
	const { model } = action.data

	return `
		CREATE TABLE IF NOT EXISTS \`${model.tableName}\` (
			${[...model.attributes]
				.sort((a, b) => (a.order || 0) - (b.order || 0))
				.map((attribute) => {
					const name = attribute.name
					const type = mapAttributeTypeToMySQLType(attribute.type)
					const nullable = attribute.nullable ? 'NULL' : 'NOT NULL'
					const def = type !== 'text' && attribute.default ? `DEFAULT ${attribute.default}` : ''
					const pk = attribute.name === 'id' ? 'PRIMARY KEY' : ''
					const ai = attribute.type === 'a_i' ? 'AUTO_INCREMENT UNIQUE' : ''

					return `\`${name}\` ${type} ${nullable} ${ai} ${def} ${pk}`
				})
				.join(',')}
			${
				model.auditDates
					? `,
				\`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`updatedAt\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
				\`deletedAt\` DATETIME NULL
			`
					: ''
			}
		);
	`
}
