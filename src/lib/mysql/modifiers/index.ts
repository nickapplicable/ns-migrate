import { DiffAction } from '../types'
import { getAttributeQueries } from './attribute'
import { getModelQueries } from './model'
import { getRelationQueries } from './relation'

export const getQueries = (actions: DiffAction[]) => {
	const modelQueries = getModelQueries(actions)
	const attributeQueries = getAttributeQueries(actions)
	const relationQueries = getRelationQueries(actions)

	const queries = [...modelQueries, ...attributeQueries, ...relationQueries]
		.sort((a, b) => a.priority - b.priority)
		.map((x) => x.query)

	return queries
}
