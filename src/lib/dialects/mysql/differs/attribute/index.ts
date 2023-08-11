import { Schema } from '../../../../types'
import { type AttributeAddAction, diffAttributeAdd } from './attribute-add'
import {
	type AttributeChangeTypeAction,
	diffAttributeChangeType,
} from './attribute-change-type'
import {
	type AttributeChangeDefaultAction,
	diffAttributeChangeDefault,
} from './attribute-change-default'
import {
	type AttributeRemoveAction,
	diffAttributeRemove,
} from './attribute-remove'
import {
	type AttributeRenameAction,
	diffAttributeRename,
} from './attribute-rename'
import {
	AttributeChangeNullableAction,
	diffAttributeChangeNullable,
} from './attribute-change-nullable'

export type DiffAttributeAction =
	| AttributeAddAction
	| AttributeChangeTypeAction
	| AttributeChangeDefaultAction
	| AttributeChangeNullableAction
	| AttributeRemoveAction
	| AttributeRenameAction

export const diffAttributes = (originalSchema: Schema, newSchema: Schema) => {
	return [
		...diffAttributeRemove(originalSchema, newSchema),
		...diffAttributeAdd(originalSchema, newSchema),
		...diffAttributeRename(originalSchema, newSchema),
		...diffAttributeChangeType(originalSchema, newSchema),
		...diffAttributeChangeDefault(originalSchema, newSchema),
		...diffAttributeChangeNullable(originalSchema, newSchema),
	]
}
