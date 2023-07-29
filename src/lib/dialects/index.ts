import postgres from './postgres'

const dialects = {
	postgres,
}

export type Dialect = keyof typeof dialects

export const getDialect = (dialect: Dialect) => {
	return dialects[dialect]
}
