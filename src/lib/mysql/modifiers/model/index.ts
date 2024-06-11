import { format } from 'sql-formatter'
import { DiffAction } from '../../types'
import { modelAddQuery } from './model-add'
import { modelRemoveQuery } from './model-remove'
import { modelRenameQuery } from './model-rename'
import { Query, isQuery } from '../../utils'

export const getModelQueries = (actions: DiffAction[]): Query[] => {
	return actions
		.map((action) => {
			switch (action.type) {
				case 'model-add':
					return { priority: action.priority, query: modelAddQuery(action) }
				case 'model-remove':
					return { priority: action.priority, query: modelRemoveQuery(action) }
				case 'model-rename':
					return { priority: action.priority, query: modelRenameQuery(action) }

				default:
					return undefined
			}
		})
		.filter(isQuery)
		.map((x) => ({
			query: format(x.query, { language: 'mysql', keywordCase: 'upper' }),
			priority: x.priority,
		}))
}
