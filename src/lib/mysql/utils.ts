import { AttributeType } from '../types'
import { DiffAction } from './types'

export const mapAttributeTypeToMySQLType = (type: AttributeType) => {
	switch (type) {
		case 'varchar':
			return 'varchar(255)'
		case 'text':
		case 'password':
			return 'text'
		case 'base64':
			return 'longtext'
		case 'id':
			return 'varchar(36)'
		case 'int':
		case 'a_i':
			return 'int(11)'
		case 'float':
			return 'float'
		case 'boolean':
			return 'tinyint(1)'
		case 'date':
			return 'date'
		case 'time':
			return 'time'
		case 'datetime':
			return 'datetime'
		default:
			return 'text'
	}
}

export const mapMySQLTypeToAttributeType = (type: string, autoIncrement: boolean): AttributeType => {
	switch (type) {
		case 'text':
		case 'password':
			return AttributeType.text
		case 'longtext':
			return AttributeType.base64
		case 'varchar(36)':
			return AttributeType.id
		case 'varchar(255)':
			return AttributeType.varchar
		case 'int(11)':
			if (autoIncrement) return AttributeType.a_i
			return AttributeType.int
		case 'float':
			return AttributeType.float
		case 'tinyint(1)':
			return AttributeType.boolean
		case 'date':
			return AttributeType.date
		case 'time':
			return AttributeType.time
		case 'datetime':
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
