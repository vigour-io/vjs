/*
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
/*
/*
  useragent sniffing is never used for feature detection, for a multi-screen app you do need information about the device also when running in the browser
  has fields V.ua.platform, device, browser and version. This implementation when compiled, is only 700 bytes
*/
var util = require('../util')
/**
 * test
 * search for regexps in the userAgent
 * fn is a on succes callback
 * check http://www.useragentstring.com/ to test for userAgents
 * @method
 */
, test = exports.test = function( _ua, fn ) {

  for
  ( var tests = util.arg( arguments, 1 )
      , i = tests.length - 1
      , query = tests[i][0]
    ; query !== true && !new RegExp( query ).test( _ua )
    ; query = tests[--i][0]
  )

  ;if( fn.slice || fn.call( this, query, tests[i] ) )
  {
    this[fn] = tests[i][1]
  }

}
, parse = exports.parse = function(_ua, obj) {

  if( !_ua )
  {
    obj = exports
    _ua = typeof navigator !== 'undefined'
        ? navigator.userAgent.toLowerCase()
        : 'no navigator'
  }

  // _ua = 'webos; linux bla bla large screen'

  var _ff = 'firefox'
    , _android = 'android'
    , _mobile = '.+mobile'
    , _webkit = 'webkit'
    , _ps = 'playstation'
    , _xbox = 'xbox'
    , _linux = 'linux'
    , _castDetect = 'crkey.+tv'
    , _chromecast = 'chromecast'
    , _tablet = 'tablet'
    , _windows = 'windows'
    , _phone = 'phone'
    , _iphoneVersion

  test.call
  ( obj
  , _ua
  , function( query, arr ) {

      obj.browser = arr[2] || query

      var _v = _ua.match
      ( new RegExp
        ( '((([\\/ ]version|'
        + arr[0]
        + '(?!.+version))[\/ ])| rv:)([0-9]{1,4}\\.[0-9]{0,2})'
        )
      )

      obj.version = _v ? Number( _v[4] ) : 0
      obj.prefix = arr[1]
      //TODO: add prefix for opera v>12.15;
      //TODO: windows check for ie 11 may be too general;
    }
  , [ true, _webkit ]
  , [ '\\(windows', 'ms', 'ie' ]
  , [ 'safari', _webkit ]
  , [ _ff, 'Moz' ]
  , [ 'opera', 'O' ]
  , [ 'msie', 'ms', 'ie' ]
  , [ 'chrome|crios\/', _webkit, 'chrome' ]
  )

  /**
  * platform detection
  */
  test.call
  ( obj
  , _ua
  , 'platform'
  , [ true, _windows ]
  , [ _linux, _linux ]
  , [ _ff + _mobile, _ff ]
  , [ 'mac os x', 'mac' ]
  , [ 'iphone|ipod|ipad', 'ios' ]
  , [ _xbox, _xbox ]
  , [ _ps, _ps ]
  , [ _castDetect, _chromecast ]
  , [ _android, _android ]
  , [ 'smart-tv;', 'samsung' ]
  )

  // document.wr
  /**
  * device detection
  */
  test.call
  ( obj
  , _ua
  , 'device'
  , [ true, 'desktop' ]
  , [ _windows + '.+touch|ipad|' + _android,  _tablet ]
  , [ 'iphone|(' + _android + _mobile + ')|(' + _ff + _mobile + ')|' + _windows + ' phone|iemobile'
    , _phone
    ]
  , [ _xbox + '|' + _ps, 'console' ]
  , [ 'tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv|webos.+large', 'tv' ]
  , [ _castDetect, _chromecast ]
  , [ 'amazon-fireos', _tablet ]
  )

  //TODO: amazon firetv and phone

  if
  ( obj.platform === _android
    && obj.device === _phone
    && window.innerWidth > 600
    // && ~_ua.indexOf('crosswalk')
  )
  {
    obj.device = 'tablet'
  }

  return obj
}

if( !util.isNode ) 
{ 
  parse()
  //TODO: this is very ugly, try to find a better solution
  if( window.__ua__ ) 
  {
    for( var field in window.__ua__ )
    {
      exports[field] = window.__ua__[field]
    }
  }
}

/**
 * prop
 * re-writes js properties to their css counterpart
 * e.g. webkitTransform --> -webkit-transform
 * now its commented since its not nessecary yet
 * @method
 */
// this.prop = function(str) {
//  return str.replace(this.prefix,'-'+this.prefix+'-').toLowerCase();
// }
