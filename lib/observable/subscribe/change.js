'use strict'
var encoded = require('./shared').encoded
var keepListener = require('./shared').keepListener
var onChange = require('./on/change')

exports.$define = {
  $addChangeListener: function (property, val, key, event, refLevel, level, meta, map) {
    // remove all related listeners', property._$path)

    var $listensOnAttach = this.$listensOnAttach
    var propPath = property._$path // this is wrong!

    if (refLevel > 1 && level) {
      var find = this._$parent._$parent
      for (var i = 1; i < refLevel; i++) {
        find = find._$input
      }
      if (propPath[0] === find.$key) {
        propPath.shift()
      }
    }

    propPath = propPath.join('.')

    // mark the field as found, with refLvl and lvl
    val[key] = encoded(refLevel, level)
    if ($listensOnAttach) {
      $listensOnAttach.each(function (p) {
        var type = p.$key
        // remove redundant property and parent listeners
        if (type === '$property') {
          p.$attach.each(function removeRedundantListeners (prop, key) {
            if (!keepListener(val, prop[2])) {
              p.$attach.$removeProperty(prop, key)
            }
          })
        } else if (type === '$addToParent') {
          // p.$attach.each( function removeRedundantListeners( prop, key ) {
          //   if( !keepListener( val, prop[ 2 ] ) ) {
          //     p.$attach.$removeProperty( prop, key )
          //   }
          // } )
          // remove change listeners which are listening for the same thing
        } else if (type === '$change') {
          // perhaps pass this path in attach
          p.$attach.each(function (prop, key) {
            // proppath does not work has to be nested field as well
            // the refs themself can have a listener as well
            if (key === propPath) {
              p.$attach.$removeProperty(prop, key)
            }
          })
        }
      })
    }

    property.on('$change', [onChange, this, refLevel, level, map, property], propPath)

    if (meta) {
      this._execEmit(property, map, refLevel, event, event.$type === '$addToParent')
    }
  }
}
