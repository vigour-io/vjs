'use strict'
var Base = require('../base')
var urlapi = require('url')

/**
 * @function Parse a url
 * @param  {string} url - Url string that needs to be parsed
 * @return {object} - Base Object with url properties (e.g path, querystring)
 */

module.exports = parseUrl

function parseUrl (url) {
  var parsed = urlapi.parse(url)
  return new Base({
    auth: parsed.auth,
    hash: parsed.hash,
    host: parsed.host,
    hostname: parsed.hostname,
    href: parsed.href,
    urlpath: parsed.path,
    pathname: parsed.pathname,
    port: parsed.port,
    protocol: parsed.protocol,
    query: parsed.query,
    search: parsed.search,
    slashes: parsed.slashes
  })
}
