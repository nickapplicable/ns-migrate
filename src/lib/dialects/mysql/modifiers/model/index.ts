import { format } from 'sql-formatter'
import { DiffAction } from '../../types'

import { modelAddQuery } from './model-add'
import { modelRemoveQuery } from './model-remove'
import { modelRenameQuery } from './model-rename'

export const getModelQueries = (actions: DiffAction[]): string[] => {
	return actions
		.map((action) => {
			switch (action.type) {
				case 'model-add':
					return modelAddQuery(action)
				case 'model-remove':
					return modelRemoveQuery(action)
				case 'model-rename':
					return modelRenameQuery(action)

				default:
					return undefined
			}
		})
		.filter((x: any): x is string => x !== undefined)
		.map((x) => format(x, { language: 'mysql', keywordCase: 'upper' }))
}
