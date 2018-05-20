import constants from './constants'

/**
 * @typedef {Object} QueryOptions
 * @property {Object} args Query arguments
 */

/**
 * @typedef {Object} ValidationResponse
 * @property {String} message Validation message
 * @property {Boolean} valid Validation status
 */

/**
 * Response for a validation construct
 * @param {String} msg Validation message
 * @returns {ValidationResponse} ValidationResponse
 */
const validationResponse = (msg) => ({
  message: constants.PROJECT_NAMESPACE + msg,
  valid: !msg
})

/**
 * Validate query schema
 * @param {Object} schema Query schema
 * @returns {ValidationResponse} ValidationResponse
 */
const validateSchema = (schema) => {
  if (!schema) return validationResponse(constants.MESSAGES.EMPTY_SCHEMA)

  return validationResponse()
}

/**
 * Validate the passed props to ensure that all properties are as expected
 * @param {...QueryOptions} options Query options
 * @param {Object} schema Query schema
 * @returns {ValidationResponse} ValidationResponse
 */
const validateOptions = (options, schema) => {
  return validationResponse()
}

/**
 * Composes the arguments for a given query
 * @param {Object} args All query arguments
 * @param {String} specificSchema The schema key name to get the args from
 * @returns {String} Composed arguments for the schema
 */
const composeArgs = (args, specificSchema) => {
  if (!args || !args[specificSchema]) return ''

  const argsForSchema = args[specificSchema]

  const composedArgs = []

  Object.keys(argsForSchema).forEach(arg => {
    composedArgs.push(`${arg}:${JSON.stringify(argsForSchema[arg])}`)
  })

  return composedArgs.length > 0
    ? ` (${composedArgs.toString()})`
    : ''
}

/**
 * Convert a JavaScript object to the equivalent GraphQL query
 * @param {Object} fields Query fields
 * @returns {String} Stringified fields
 */
const stringifyField = (fields) => {
  const composedFields = []

  Object.keys(fields).forEach(field => {
    // If field is an object, recursively call the stringifyField function with the object to get the nested items
    if (typeof fields[field] === 'object' && fields[field] !== null) {
      composedFields.push(`${field} {${stringifyField(fields[field])}}`)
    } else {
      composedFields.push(field)
    }
  })

  return composedFields.toString()
}

/**
 * Compose the fields in a GraphQL query
 * @param {Object} fields Query fields
 * @returns {String} Composed string
 */
const composeFields = (fields) => stringifyField(fields)

/**
 * Compose a GraphQL query using the passed schema and options
 * @param {Object} schema Query schema
 * @param {...QueryOptions} options Optional query options
 * @returns {String} Compiled query
 */
const composeQuery = (schema, options) => {
  const args = options && options.args

  let query = ''

  Object.keys(schema).forEach(schemaItem => {
    query += `${schemaItem}${composeArgs(args, schemaItem)} {
      ${composeFields(schema[schemaItem])}
    }`
  })

  return `{
    ${query}
  }`
}

/**
 * Validate and create a GraphQL query using the passed parameters
 * @param {Object} schema Query schema
 * @param {...QueryOptions} options Optional query option
 * @returns {String} Compiled query
 */
const quib = (schema, options) => {
  const validSchema = validateSchema(schema)
  if (!validSchema.valid) {
    throw new Error(validSchema.message)
  }

  const validOptions = validateOptions(options)
  if (!validOptions.valid) {
    throw new Error(validOptions.message)
  }

  return composeQuery(schema, options)
}

export default quib
