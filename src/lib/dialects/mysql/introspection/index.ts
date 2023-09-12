import { getRefs } from './fns/getRefs'
import { getTables } from './fns/getTables'
import { getColumns } from './fns/getColumns'
import { mapMySQLTypeToAttributeType } from '../utils'
import { getColumnDefaults } from './fns/getColumnDefaults'
import { QueryFn, Schema, Relation, RelationType } from '../../../types'
import { getForeignKeyConstraints } from './fns/getForeignKeyConstraints'

export const getSchema = async (query: QueryFn): Promise<Schema> => {
	const _refs = await getRefs(query)
	const tables = await getTables(query)
	const columns = await getColumns(query)
	const defaults = await getColumnDefaults(query)
	const fks = await getForeignKeyConstraints(query)

	const models = tables
		.filter((x) => x.name[0] !== '_')
		.map((table) => {
			const _ref_table = _refs.find((_ref) => _ref.type === 'm' && _ref.name === table.name)

			const hasAuditDates =
				columns
					.filter((x) => x.tableName === table.name)
					.filter((x) => x.name === 'createdAt' || x.name === 'updatedAt' || x.name === 'deletedAt')
					.length === 3

			const attributes = columns
				.filter((x) => x.tableName === table.name)
				.filter((x) => x.name !== 'createdAt' && x.name !== 'updatedAt' && x.name !== 'deletedAt')
				.map((column) => {
					const _ref_attr = _refs.find(
						(_ref) =>
							(_ref.type === 'a' || _ref.type === 'r') &&
							_ref.name === column.name &&
							_ref.tableName === table.name
					)

					const attr = {
						id: _ref_attr?.id || null,
						name: column.name,
						type: mapMySQLTypeToAttributeType(column.type),
						default:
							defaults.find((x) => x.tableName === table.name && x.columnName === column.name)
								?.defaultValue || null,
						nullable: !column.notnull,
						modelId: _ref_table?.id,
					}

					return attr
				})

			return {
				id: _ref_table?.id || null,
				tableName: table.name,
				auditDates: hasAuditDates,
				posX: _ref_table?.posX || 0,
				posY: _ref_table?.posY || 0,
				attributes: [...attributes],
			}
		})

	// type Relation = {
	// 	id: string
	// 	optional: boolean
	// 	type: RelationType
	// 	sourceId: string
	// 	sourceName?: string | null
	// 	sourceOrder: number
	// 	targetId: string
	// 	targetName?: string | null
	// 	targetOrder: number
	// }

	const relations = fks
		.filter((x) => x.type === 'FOREIGN KEY')
		.map((fk) => {
			const _ref_fk = _refs.find(
				(_ref) => _ref.type === 'r' && _ref.name === fk.columnName && _ref.tableName === fk.tableName
			)

			const sourceModel = models.find((x) => x.tableName === fk.tableName)
			const targetModel = models.find((x) => x.tableName === fk.targetTable)

			if (!_ref_fk || !sourceModel || !targetModel || !sourceModel.id || !targetModel.id) return null

			const type = RelationType.manyToOne

			const optional =
				targetModel.attributes.find((x) => x.name === sourceModel.tableName + 'Id')?.nullable || false

			return {
				id: _ref_fk.id,
				optional,
				type,
				sourceId: sourceModel.id,
				sourceName: sourceModel.tableName,
				sourceOrder: 0,
				targetId: targetModel.id,
				targetName: targetModel.tableName,
				targetOrder: 0,
			}
		})
		.filter(<T>(x: T | null): x is T => x !== null)

	return {
		models,
		relations,
	}
}
