import camelcaseKeys from 'camelcase-keys'
import omitEmpty from 'omit-empty'

export function normalizeRequest(req, res, next) {
  if (!req.locals) req.locals = {}

  // Removes empty values
  req.body = omitEmpty(req.body)
  req.params = omitEmpty(req.params)
  req.locals.query = omitEmpty(req.query) // We use locals for query because we cannot overwrite req.query in Express 5.

  // Converts properties into camelcase
  req.body = camelcaseKeys(req.body, { deep: true })
  req.params = camelcaseKeys(req.params)
  req.locals.query = camelcaseKeys(req.locals.query)

  next()
}
