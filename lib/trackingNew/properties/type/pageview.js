var pageDefaults = require('../pageDefaults.js')
var DataLayer = require('../../emitter/datalayer')

function defaults (dest, defaults) {
  for (var prop in defaults) {
    if (!(prop in dest)) {
      dest[prop] = defaults[prop]
    }
  }
  return dest
}
// function pageview (category, name, properties, options, fn) {
function pageview (data, callback) {
  var defs = pageDefaults()

  let page = new DataLayer({
    url: defs.url,
    referrer: defs.referrer,
    title: defs.title,
    search: defs.search,
    pagePath: defs.path,
    name: defs.title
  })
  
  // if (data.name) page.name = name
  // if (data.category) page.category = category
}

module.exports = pageview
