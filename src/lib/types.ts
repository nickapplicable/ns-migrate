export enum AttributeType {
	'uuid' = 'uuid',
	'a_i' = 'a_i',
	'text' = 'text',
	'password' = 'password',
	'int' = 'int',
	'float' = 'float',
	'boolean' = 'boolean',
	'datetime' = 'datetime',
	'date' = 'date',
	'time' = 'time',
}

export enum RelationType {
	'oneToOne' = 'oneToOne',
	'oneToMany' = 'oneToMany',
	'manyToOne' = 'manyToOne',
	'manyToMany' = 'manyToMany',
}

export type Relation = {
	id: string
	optional: boolean
	type: RelationType
	sourceId: string
	sourceName?: string | null
	sourceOrder: number
	targetId: string
	targetName?: string | null
	targetOrder: number
}

export type Attribute = {
	id?: string | null
	name: string
	type: AttributeType
	default?: string | null
	selectable?: boolean
	order?: number
	nullable: boolean
	modelId?: string
}

export type Model = {
	id?: string | null
	name?: string | null
	tableName: string
	auditDates: boolean
	attributes: Attribute[]
}

export type Schema = {
	models: Model[]
	relations: Relation[]
}
