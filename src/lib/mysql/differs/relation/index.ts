import { Schema } from '../../../types'
import { type RelationAddAction, diffRelationAdd } from './relation-add'
import { type RelationRemoveAction, diffRelationRemove } from './relation-remove'

export type DiffRelationAction = RelationAddAction | RelationRemoveAction

export const diffRelations = (originalSchema: Schema, newSchema: Schema) => {
	return [...diffRelationRemove(originalSchema, newSchema), ...diffRelationAdd(originalSchema, newSchema)]
}
