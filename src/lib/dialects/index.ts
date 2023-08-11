import postgres from './postgres'
import mysql from './mysql'

const dialects = {
	postgres,
	mysql,
} as const

export type Dialect = keyof typeof dialects

export const getDialect = <K extends keyof typeof dialects>(
	dialect: K
): (typeof dialects)[K] => {
	return dialects[dialect]
}
