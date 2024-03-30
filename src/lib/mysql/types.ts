import { DiffAttributeAction } from './differs/attribute'
import { DiffModelAction } from './differs/model'
import { DiffRelationAction } from './differs/relation'

export type DiffAction =
	| DiffModelAction
	| DiffAttributeAction
	| DiffRelationAction
