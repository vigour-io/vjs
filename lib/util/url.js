'use strict'
var urlapi = require('url')

/**
 * @function Parse a url
 * @param  {string} url - Url string that needs to be parsed
 * @return {object} - Object with url path, host, port, hash and search parameters
 */

module.exports = parseUrl

function parseUrl (url) {
  var url = urlapi.parse(url)
  console.log(url)
  return url
}



// var urlapi = require('url'),
//     url = urlapi.parse('http://site.com:81/path/page?a=1&b=2#hash');
//
// console.log(
// 	url.href + '\n' +			// the full URL
// 	url.protocol + '\n' +		// http:
// 	url.hostname + '\n' +		// site.com
// 	url.port + '\n' +			// 81
// 	url.pathname + '\n' +		// /path/page
// 	url.search + '\n' +			// ?a=1&b=2
// 	url.hash					// #hash
// );
