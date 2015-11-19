/**
 * Parse the given `url`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function (url) {
  var a = document.createElement('a')
  a.href = url
  return {
    href: a.href,
    host: a.host || window.location.host,
    port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
    hash: a.hash,
    hostname: a.hostname || window.location.hostname,
    pathname: a.pathname.charAt(0) !== '/' ? '/' + a.pathname : a.pathname,
    protocol: !a.protocol || ':' == a.protocol ? window.location.protocol : a.protocol,
    search: a.search,
    query: a.search.slice(1)
  }
}

exports.isAbsolute = function (url) {
  return 0 == url.indexOf('//') || !!~url.indexOf('://')
}

exports.isRelative = function (url) {
  return !exports.isAbsolute(url)
}

exports.isCrossDomain = function (url) {
  url = exports.parse(url)
  var location = exports.parse(window.location.href)
  return url.hostname !== location.hostname
    || url.port !== location.port
    || url.protocol !== location.protocol
}
