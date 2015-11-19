var url = require('./url')

function canonical () {
  var tags = document.getElementsByTagName('link')
  for (var i = 0, tag; tag = tags[i]; i++) {
    if ('canonical' == tag.getAttribute('rel')) return tag.getAttribute('href')
  }
}

function pageDefaults () {
  return {
    path: canonicalPath(),
    referrer: document.referrer,
    search: location.search,
    title: document.title,
    url: canonicalUrl(window.location.search)
  }
}

function canonicalPath () {
  var canon = canonical()
  if (!canon) return window.location.pathname
  var parsed = url.parse(canon)
  return parsed.pathname
}

/**
 * Return the canonical URL for the page concat the given `search`
 * and strip the hash.
 *
 * @param {string} search
 * @return {string}
 */

function canonicalUrl (search) {
  var canon = canonical()
  if (canon) return includes('?', canon) ? canon : canon + search
  var url = window.location.href
  var i = url.indexOf('#')
  return i === -1 ? url : url.slice(0, i)
}

/**
 * Exports.
 */

module.exports = pageDefaults
