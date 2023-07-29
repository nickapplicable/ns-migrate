import { Schema } from '../../types'
import { getSchema } from './introspection'
import { getQueries as getAllQueries } from './modifiers'
import { createRefTable } from './introspection/createRefTable'
import { updateRefs } from './introspection/updateRefs'
import { getDiffActions } from './differs'
import { getProblematicActions } from './utils'

const getQueries = (
	originalSchema: Schema,
	newSchema: Schema,
	force: boolean = false
) => {
	const actions = getDiffActions(originalSchema, newSchema)

	if (!force) {
		const problemActions = getProblematicActions(actions)
		if (problemActions.length > 0) {
			throw new Error(
				`There are problematic actions, please fix them first: ${JSON.stringify(
					problemActions,
					null,
					2
				)}`
			)
		}
	}

	return getAllQueries(actions)
}

export default {
	getSchema,
	getQueries,
	updateRefs,
	createRefTable,
}
