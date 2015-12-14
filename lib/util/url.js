'use strict'
var urlapi = require('url')

/**
 * @function Parse a url
 * @param  {string} url - Url string that needs to be parsed
 * @return {object} - Object with url path, host, port, hash and search parameters
 */

module.exports = parseUrl

function parseUrl (url) {
  return urlapi.parse(url)
}
