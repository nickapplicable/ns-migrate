import { format } from 'sql-formatter'
import { DiffAction } from '../../types'
import { relationAddQuery } from './relation-add'
import { relationRemoveQuery } from './relation-remove'
import { Query, isQuery } from '../../utils'

export const getRelationQueries = (actions: DiffAction[]): Query[] => {
	return actions
		.map((action) => {
			switch (action.type) {
				case 'relation-add':
					return { priority: action.priority, query: relationAddQuery(action) }
				case 'relation-remove':
					return { priority: action.priority, query: relationRemoveQuery(action) }

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
