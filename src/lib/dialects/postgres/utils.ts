import { AttributeType } from '../../types'
import { DiffAction } from './types'

export const mapAttributeTypeToPgType = (type: AttributeType) => {
	switch (type) {
		case 'text':
		case 'password':
			return 'text'
		case 'uuid':
			return 'uuid'
		case 'int':
			return 'int8'
		case 'float':
			return 'float8'
		case 'boolean':
			return 'boolean'
		case 'date':
			return 'date'
		case 'time':
			return 'timetz'
		case 'datetime':
			return 'timestamptz'
		default:
			return 'text'
	}
}

export const mapPgTypeToAttributeType = (type: string): AttributeType => {
	switch (type) {
		case 'text':
		case 'password':
			return AttributeType.text
		case 'uuid':
			return AttributeType.uuid
		case 'int8':
			return AttributeType.int
		case 'float8':
			return AttributeType.float
		case 'boolean':
			return AttributeType.boolean
		case 'date':
			return AttributeType.date
		case 'timetz':
			return AttributeType.time
		case 'timestamptz':
			return AttributeType.datetime
		default:
			return AttributeType.text
	}
}

export const getProblematicActions = (actions: DiffAction[]) => {
	return actions.filter((action) => {
		switch (action.type) {
			case 'attribute-remove':
				return true
			default:
				return false
		}
	})
}

export const getProblemMessage = (action: DiffAction) => {
	switch (action.type) {
		case 'attribute-remove':
			return `Potential data loss by dropping the "${action.data.tableName}.${action.data.attributeName}" column.`
		default:
			return ''
	}
}
