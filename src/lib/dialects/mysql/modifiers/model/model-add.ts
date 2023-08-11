import { ModelAddAction } from '../../differs/model/model-add'
import { mapAttributeTypeToMySQLType } from '../../utils'

export const modelAddQuery = (action: ModelAddAction) => {
	const { model } = action.data

	return `
		CREATE TABLE IF NOT EXISTS \`${model.tableName}\` (
			${[...model.attributes]
				// .sort((a, b) => (a.order || 0) - (b.order || 0))
				.map((attribute) => {
					let def = attribute.default

					return `\`${attribute.name}\` ${mapAttributeTypeToMySQLType(
						attribute.type
					)} ${attribute.nullable ? 'NULL' : 'NOT NULL'} ${
						def ? `DEFAULT ${def}` : ''
					}`
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
