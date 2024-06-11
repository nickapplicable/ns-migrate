import { format } from 'sql-formatter'
import { DiffAction } from '../../types'
import { attributeAddQuery } from './attribute-add'
import { attributeRemoveQuery } from './attribute-remove'
import { attributeRenameQuery } from './attribute-rename'
import { attributeChangeTypeQuery } from './attribute-change-type'
import { attributeChangeDefaultQuery } from './attribute-change-default'
import { Query, isQuery } from '../../utils'

export const getAttributeQueries = (actions: DiffAction[]): Query[] => {
	return actions
		.map((action) => {
			switch (action.type) {
				case 'attribute-add':
					return { priority: action.priority, query: attributeAddQuery(action) }
				case 'attribute-remove':
					return { priority: action.priority, query: attributeRemoveQuery(action) }
				case 'attribute-rename':
					return { priority: action.priority, query: attributeRenameQuery(action) }
				case 'attribute-change-type':
					return { priority: action.priority, query: attributeChangeTypeQuery(action) }
				case 'attribute-change-default':
					return { priority: action.priority, query: attributeChangeDefaultQuery(action) }

				default:
					return undefined
			}
		})
		.flat()
		.filter(isQuery)
		.map((x) => ({
			query: format(x.query, { language: 'mysql', keywordCase: 'upper' }),
			priority: x.priority,
		}))
}
