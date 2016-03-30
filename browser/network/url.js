var util = require('../../util')
  , Value = require('../../value')
  , config = require('../../util/config')
  , process = require('../../value/flags/process')
  , raf = require('../../browser/animation/raf')
  , postpone = require('../../browser/events/util').postpone

module.exports = exports = new Value()
//TODO: .params /w listeners!

config.hashUrl = true

var pstate = !config.hashUrl //= !window.DEBUG$ && window.history && window.history.pushState
  , cnt = 0
  , timedState
  , state = postpone ( pstate ? function(val) {
      //load current params as well
      //same goes for the other
      //we could add a delay here!
      href = window.location.href
      history.pushState({}, val, val.replace(/ /g, '+').replace(/^#\//, '').toLowerCase() )
    } : function(val) {
      exports.block = true
      window.location.href = '#/' + val.replace(/ /g, '+').toLowerCase()
      exports.block = false
    } )
  , _set = Value.prototype._set
  , parse = function() {
      if (!pstate) 
      {
        var url = window.location.href.split('#')
        return (url.length > 1 ? url[1].replace(/\+/g, ' ') : ' ').slice(1)
      } else 
      {
        return String(window.location.href)
               .replace(String(window.location.origin) + '/', '')
               .replace(/^#\//, '')
               .replace(/\+/g, ' ')
               || ''
      }
    }
  , query = function( str ) {
      if(!str) str = parse() || ''
      var arr = str.split('?')
        , len = arr.length
      str = len > 1 && arr[ arr.length - 1 ] ? '?'+arr[ arr.length - 1 ] : ''
      return str
    }

exports.parse = parse

//TODO: back btn hijack (event hijack add random param)
//TODO: use raf for updates
exports.val = { 
  string: function() {
    var str = parse()
    return str.replace( query( str ), '' )
  },
  params: {
    val: function() { return query() },
    defer:function( update ) {
      // this.val
      this.clearCache() //maybe not?

      var val = this.val
        , params
        , nestedparams
        , c

      if( val && val!==this._last ) {
        this._last = val
        params = val.slice(1).split(',')
        nestedparams = {}
        for( var i in params ) {
          c = params[i].split('=')
          if( c.length>1 ) 
          {
            nestedparams[c[0]] = c[1]
          }
          else
          {
            console.warn('no [key]=[value] format -- not implemented yet')
          }
        }
        this.val = nestedparams
      }
      // console.log('lets parse this url! params'.cyan.bold, params, val)
      raf(function() { update() })
    }
  },
  transform: function( v, cv ) {
    return cv
  },
  defer: function( update, args ) {
    if( args[1] && args[1][0] === 'u' ) 
    {
      this.clearCache()
      raf( function() {
        update()
      })
    } else 
    {
      this.clearCache()
      var a = ( typeof args[0] === 'string'  ? args[0] : args[0] && args[0].val || this.val )
      if(a) 
      {
        exports.blocks = cnt
        state( a + this.params.val )
      }
      return  true
      //TODO: update( true ) blocks all consecutive updates
    }
  }
}

function urlEvent(e) {
  var stamp
  if( exports.blocks!==cnt ) 
  {
    //only update if there really is a change!
    // console.log('URL EVENT! 2'.green.inverse, cnt)
    cnt++
    stamp = 'u'+cnt
    exports.clearCache()
    exports.string.clearCache() //maybe not clear on string?
    // exports._update( parse(), 'url' )
    exports.string._update( exports.string.val , stamp )
    exports.params._update( exports.string.val, stamp )
    exports._update( exports.string.val, stamp )
    exports._lstamp = null

  } else {
    cnt++
  }
}

util.define(exports, 'update', function() {
  urlEvent()
})

window.onhashchange = urlEvent
//TODO: add popstate

