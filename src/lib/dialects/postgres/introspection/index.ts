import { Client } from 'pg'
import { getIds } from './fns/getIds'
import { getTables } from './fns/getTables'
import { getColumns } from './fns/getColumns'
import { mapPgTypeToAttributeType } from '../utils'
import { getColumnDefaults } from './fns/getColumnDefaults'
import { Schema } from '../../../types'

export const getSchema = async (db: Client): Promise<Schema> => {
	const _dynamo = await getIds(db)
	const tables = await getTables(db)
	const columns = await getColumns(db)
	const defaults = await getColumnDefaults(db)

	const schema = {
		models: tables
			.filter((x) => x.name[0] !== '_')
			.map((table) => {
				const _d_table = _dynamo.find(
					(_d) => _d.type === 'm' && _d.name === table.name
				)

				const hasAuditDates =
					columns
						.filter((x) => x.table === table.name)
						.filter(
							(x) =>
								x.name === 'createdAt' ||
								x.name === 'updatedAt' ||
								x.name === 'deletedAt'
						).length === 3

				const attributes = columns
					.filter((x) => x.table === table.name)
					.filter(
						(x) =>
							x.name !== 'createdAt' &&
							x.name !== 'updatedAt' &&
							x.name !== 'deletedAt'
					)
					.map((column) => {
						const _d_attr = _dynamo.find(
							(_d) =>
								(_d.type === 'a' || _d.type === 'r') &&
								_d.name === column.name &&
								_d.tablename === table.name
						)

						const attr = {
							id: _d_attr?.id || null,
							name: column.name,
							type: mapPgTypeToAttributeType(column.type),
							default:
								defaults.find(
									(x) =>
										x.table === table.name &&
										x.column === column.name
								)?.value || null,
							nullable: !column.notnull,
							modelId: _d_table?.id,
						}

						return attr
					})

				return {
					id: _d_table?.id || null,
					tableName: table.name,
					auditDates: hasAuditDates,
					attributes: [...attributes],
				}
			}),
		relations: [],
	}

	return schema
}
