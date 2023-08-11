import { Connection } from 'mysql2/promise'
import { getIds } from './fns/getIds'
import { getTables } from './fns/getTables'
import { getColumns } from './fns/getColumns'
import { mapMySQLTypeToAttributeType } from '../utils'
import { getColumnDefaults } from './fns/getColumnDefaults'
import { QueryFn, Schema } from '../../../types'

export const getSchema = async (query: QueryFn): Promise<Schema> => {
	const _dynamo = await getIds(query)
	const tables = await getTables(query)
	const columns = await getColumns(query)
	const defaults = await getColumnDefaults(query)

	const schema = {
		models: tables
			.filter((x) => x.name[0] !== '_')
			.map((table) => {
				const _d_table = _dynamo.find(
					(_d) => _d.type === 'm' && _d.name === table.name
				)

				const hasAuditDates =
					columns
						.filter((x) => x.tableName === table.name)
						.filter(
							(x) =>
								x.name === 'createdAt' ||
								x.name === 'updatedAt' ||
								x.name === 'deletedAt'
						).length === 3

				const attributes = columns
					.filter((x) => x.tableName === table.name)
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
								_d.tableName === table.name
						)

						const attr = {
							id: _d_attr?.id || null,
							name: column.name,
							type: mapMySQLTypeToAttributeType(column.type),
							default:
								defaults.find(
									(x) =>
										x.tableName === table.name &&
										x.columnName === column.name
								)?.defaultValue || null,
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
