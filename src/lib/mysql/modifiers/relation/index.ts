import { format } from 'sql-formatter'
import { DiffAction } from '../../types'
import { relationAddQuery } from './relation-add'
import { relationRemoveQuery } from './relation-remove'
import { Priority, Query, isQuery } from '../../utils'

export const getRelationQueries = (actions: DiffAction[]): Query[] => {
	return actions
		.map<Query | undefined>((action) => {
			switch (action.type) {
				case 'relation-remove':
					return { priority: Priority.RELATION_REMOVE, query: relationRemoveQuery(action) }
				case 'relation-add':
					return { priority: Priority.RELATION_ADD, query: relationAddQuery(action) }

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
