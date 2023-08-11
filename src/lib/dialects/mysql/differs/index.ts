import { diffAttributes } from './attribute'
import { diffModels } from './model'
import type { Schema } from '../../../types'
import { DiffAction } from '../types'

export const getDiffActions = (
	originalSchema: Schema,
	newSchema: Schema
): DiffAction[] => {
	return [
		...diffModels(originalSchema, newSchema),
		...diffAttributes(originalSchema, newSchema),
	]
}
