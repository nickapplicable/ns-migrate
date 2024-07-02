import { format } from 'sql-formatter'
import { DiffAction } from '../../types'
import { modelAddQuery } from './model-add'
import { modelRemoveQuery } from './model-remove'
import { modelRenameQuery } from './model-rename'
import { modelReorderQuery } from './model-reorder'
import { Priority, Query, isQuery } from '../../utils'

export const getModelQueries = (actions: DiffAction[]): Query[] => {
	return actions
		.map<Query | undefined>((action) => {
			switch (action.type) {
				case 'model-remove':
					return { priority: Priority.MODEL_REMOVE, query: modelRemoveQuery(action) }
				case 'model-add':
					return { priority: Priority.MODEL, query: modelAddQuery(action) }
				case 'model-rename':
					return { priority: Priority.MODEL, query: modelRenameQuery(action) }
				case 'model-reorder':
					return { priority: Priority.MODEL, query: modelReorderQuery(action) }

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
