import { DiffAttributeAction } from './differs/attribute'
import { DiffModelAction } from './differs/model'

export type DiffAction = DiffModelAction | DiffAttributeAction
