import { ModelAddAction } from '../../differs/model/model-add'
import { mapAttributeTypeToPgType } from '../../utils'

export const modelAddQuery = (action: ModelAddAction) => {
	const { model } = action.data

	return `
		CREATE TABLE "${model.tableName}" (
			${[...model.attributes]
				// .sort((a, b) => (a.order || 0) - (b.order || 0))
				.map((attribute) => {
					let def = attribute.default

					if (attribute.name === 'id') {
						def = 'uuid_generate_v4()'
					}

					return `"${attribute.name}" ${mapAttributeTypeToPgType(
						attribute.type
					)} ${attribute.nullable ? 'NULL' : 'NOT NULL'} ${
						def ? `DEFAULT ${def}` : ''
					}`
				})
				.join(',')}
			${
				model.auditDates
					? `,
				"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
				"deletedAt" TIMESTAMPTZ NULL
			`
					: ''
			}
		);
	`
}
