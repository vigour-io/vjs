var _ = require('lodash')

function fix (subject, model) {
  _.each(model, function (modelValue, modelKey) {

    if ( subject[modelKey] === modelValue ) return

    if ( _.isNull(subject[modelKey]) )      return

    if ( _.isUndefined(subject[modelKey]) ) return subject[modelKey] = null

    if ( _.isObject(modelValue) )           return fix(subject[modelKey], modelValue)
  })
}


function parseDiff (before, after) {
  var difference = {}
  _.each(after, function (value, key) {
    if ( _.isEqual(before[key], value) ) return

    if ( _.isNull(before[key]) )         return difference[key] = value

    difference[key] = _.isObject(value) ? parseDiff(before[key], value) : value
  })
  return difference
}

function fixSchema (before, after) {
  var b = _.extend(before, {})
    , a = _.extend(after, {})

  fix(b, a)
  fix(a, b)

  return {
    before: b,
    after:  a
  }
}
// no sure if we need to use cleanUp, it's purpose was to remove irrelevant {} artifacts
// but seems it only creates problems by removing relevant data
// so now diff doesn't use it, but we need to test the output with it and without it

function cleanUp (obj) {
  var obj = _.extend(obj, {})
  _.each(obj, function (v, k) {
    if ( !_.isObject(v) ) return

    _.isEmpty(v) ? delete obj[k] : cleanUp(obj[k])
  })
  return obj
}

function diff (before, after) {
  var fixedSchemas = fixSchema(before, after)

  return parseDiff(fixedSchemas.before, fixedSchemas.after)
}

module.exports = diff
