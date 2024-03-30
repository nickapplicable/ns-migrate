import { format } from 'sql-formatter'
import { DiffAction } from '../../types'

import { attributeAddQuery } from './attribute-add'
import { attributeRemoveQuery } from './attribute-remove'
import { attributeRenameQuery } from './attribute-rename'
import { attributeChangeTypeQuery } from './attribute-change-type'
import { attributeChangeDefaultQuery } from './attribute-change-default'

export const getAttributeQueries = (actions: DiffAction[]): string[] => {
	return actions
		.map((action) => {
			switch (action.type) {
				case 'attribute-add':
					return attributeAddQuery(action)
				case 'attribute-remove':
					return attributeRemoveQuery(action)
				case 'attribute-rename':
					return attributeRenameQuery(action)
				case 'attribute-change-type':
					return attributeChangeTypeQuery(action)
				case 'attribute-change-default':
					return attributeChangeDefaultQuery(action)

				default:
					return undefined
			}
		})
		.flat()
		.filter((x: any): x is string => x !== undefined)
		.map((x) => format(x, { language: 'mysql', keywordCase: 'upper' }))
}
