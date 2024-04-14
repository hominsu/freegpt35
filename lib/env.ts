import * as process from 'process'

type ParserFunction<T> = (value: string | undefined) => T

function getEnvVariable<T>(key: string, defaultValue: T, parse: ParserFunction<T>): T {
  const value = process.env[key]
  return value !== undefined ? parse(value) : defaultValue
}

const parseString: ParserFunction<string> = (value) => value!
const parseNumber: ParserFunction<number> = (value) => Number(value!)
const parseBoolean: ParserFunction<boolean> = (value) => value === 'true'

export const getEnvString = (key: string, defaultValue: string) =>
  getEnvVariable(key, defaultValue, parseString)
export const getEnvNumber = (key: string, defaultValue: number) =>
  getEnvVariable(key, defaultValue, parseNumber)
export const getEnvBoolean = (key: string, defaultValue: boolean) =>
  getEnvVariable(key, defaultValue, parseBoolean)
