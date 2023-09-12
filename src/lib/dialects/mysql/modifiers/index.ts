import { DiffAction } from '../types'
import { getAttributeQueries } from './attribute'
import { getModelQueries } from './model'
import { getRelationQueries } from './relation'

export const getQueries = (actions: DiffAction[]) => {
	const queries = [
		...getModelQueries(actions),
		...getAttributeQueries(actions),
		...getRelationQueries(actions),
	]

	return queries
}
