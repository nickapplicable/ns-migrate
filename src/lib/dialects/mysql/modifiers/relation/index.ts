import { format } from 'sql-formatter'
import { DiffAction } from '../../types'

import { relationAddQuery } from './relation-add'
import { relationRemoveQuery } from './relation-remove'

export const getRelationQueries = (actions: DiffAction[]): string[] => {
	return actions
		.map((action) => {
			switch (action.type) {
				case 'relation-add':
					return relationAddQuery(action)
				case 'relation-remove':
					return relationRemoveQuery(action)

				default:
					return undefined
			}
		})
		.filter((x: any): x is string => x !== undefined)
		.map((x) => format(x, { language: 'mysql', keywordCase: 'upper' }))
}
