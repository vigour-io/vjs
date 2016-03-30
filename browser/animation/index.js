/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */

var element = require('../element').inject(require('../element/properties')) //element added (extend) //call extend on flags (make buffer if already extended)
  , object = require('../../object')
  , util = require('../../util')
  , flags = require('../../value/flags/util')
  , operators = require('../../value/operators')
  , frame = require('./frame')
  , _linear = function(t, b, c, d) {
    return c * t / d + b
  }
//-------------------------------------------------------------------
operators._a = function (val, operator) {
  return operator
}

function preventSet(val) {
  this._p = true
  this.val = val
  this._p = false
}

operators._a.order = 2

flags.animation = {
  set: function (val) {
    
    var thisObject = this
      , _p = thisObject.checkParent('_prop')

    if (val) {

      if (!thisObject._val) thisObject.val = 0

      var name = _p._prop.name
        , element = _p._caller
        , noListener = val.noListener
        , path = thisObject._path
        , id = name.concat(path.join(''))
        , skip = val.skip
        , easing = val.easing 
          && exports.easing[val.easing] 
          || val.easing 
          || _linear
        , time, start, ready

      if(!_p._animListen) _p._animListen = function (val) {
        var tn = this[name]
        if(tn) tn.update(this, true)
        else frame.removeListener(true, this)
      }

      element.setSetting({
        name:'animation',
        remove:function() {
          frame.removeListener(true, this)
        }
      })

      _p.preventSet = preventSet

      _p.set('translate', true)

      thisObject.set('_a', {
        time: val.time || 60,
        val: function(v, cv, b) {
          
          var t = this
            , a
            , prop = _p //t[name] ||
            , pr = t[name]

          if (!t._a) t._a = {}
        
          if (!t._a[id]) {

            start = val.start === void 0 
              ? t.rendered && (thisObject.__lval !== void 0)
                ? thisObject.__lval
                : cv
              : val.start instanceof object 
                ? val.start.val
                : val.start

            t._a[id] = {
              _start: start,
              _end: start,
              _current: start,
              _count: 0
            }

            if (!t.rendered) return start
          }

          if (t.rendered) {
            if(skip) {
              t._a[id]._current = cv
              skip = false
              return cv
            }

            a = t._a[id]
            if (pr._p || exports.prevent) {
              a._frame = 0
              frame.removeListener(prop._animListen, this, true)
              if (pr._p !== 1) {
                a._current = a._end = cv
                if (val.complete) noListener = val.complete.call(t, cv)
                if (val.done) setTimeout( function() { val.done.call(t,cv) }, 0)
                if (val.once) {
                  setTimeout( function() { 
                    if(val.once) val.once.call(t,cv) 
                    val.once = null
                  }, 0)
                }
              }
            } else if (a._frame !== frame.val) {
              if (a._frame || (cv !== void 0 && a._current !== cv)) { //checking a.frame faster than comparing a.current to cv
                if (a._end !== cv) {

                  if (val.init) val.init.call(t, a._current)
                  if(!noListener) {
                    frame.addListener([prop._animListen, this, name]
                      , function (listenArray, listeners) {
                        for(var i in listeners) {
                          if(listeners[i].pop) {
                            if(listeners[i].pop && listeners[i][1]===t && listeners[i][2]===name) {
                              return false
                            }
                          }
                        }
                       return true 
                      }
                    )
                  }
                  a._start = a._current
                  a._end = cv
                  a._count = 0
                  time = ~~v.time.val
                }
                a._frame = frame.val

                if(val.delay){
                  val.delay--
                  return a._start
                }

                var cnt = ++a._count
                a._current = easing.call(t, cnt, a._start, a._end - a._start, time || (time = ~~v.time.val))
                if(val[cnt]) val[cnt].call(this,a._current,cv)
              }
              if (a._count === time) {              
                a._current = cv
                a._frame = 0
                a._count = 0

                if (val.complete) noListener = val.complete.call(t, cv)
                if (val.done) setTimeout( function() { val.done.call(t,cv) }, 0)
                if (val.once) {
                  setTimeout( function() { 
                    if(val.once) val.once.call(t,cv) 
                    val.once = null
                  }, 0)
                }

                !noListener && frame.removeListener(prop._animListen, this, true)
              }
            }
            return a._current
          } 
        }
      })
            
      _p._skip = true
      thisObject._skip = true
      
      if (val.start !== void 0) {
        var caller = this._caller
        if(!caller) caller = this.checkParent('_prop')._caller
        caller.setRender(name, function(parent) {
          this.update(name)
        })
      }
    } 
    else {
      thisObject.remove('_a')
      thisObject._skip = void 0
      _p._skip = void 0
      _remove(_p)
    }

  }
}