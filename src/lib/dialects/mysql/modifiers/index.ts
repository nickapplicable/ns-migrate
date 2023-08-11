import { DiffAction } from '../types'
import { getAttributeQueries } from './attribute'
import { getModelQueries } from './model'

export const getQueries = (actions: DiffAction[]) => {
	const queries = [
		...getModelQueries(actions),
		...getAttributeQueries(actions),
	]

	return queries
}
