/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */
var events = require('./')
  , operators = require('../../value/operators')
  , doc = events.document

module.exports = events

operators._e = function(val, operator) {
  return val + operator
}

operators._esub = function(val, operator) {
  return val - operator
}

operators._e.order = 3
  
function chooseMove (val, method) {
  return val.move && val.move._val 
    || !method.__t && method !== true && method 
    || method._val;
}

function drag (e, method, val) {
  var t = val.bind ? val.bind._val : this
    , move = chooseMove(val, method)
    , id = 'drag'
  e.preventDefault()
  if (move) doc.addEvent('move', function(e) {
    move.call(t, e, val)
  }, id)

  if (val.down) val.down._val.call(t, e, val)
  
  doc.addEvent('up', function(e) {
    if (val.up) val.up._val.call(t, e, val)
    doc.removeEvent(false, id)
  }, id)
}

function active (e, method, val) {
  var self = this
    , id = 'active'
    , timer = setTimeout(function(){
        self.css = {addClass:val._val}
        timer = null
      },50)

  if(exports._deactivate) exports._deactivate()

  exports._deactivate = function(){
    if(timer) clearTimeout(timer)
    doc.removeEvent(false,id)
    exports._deactivate = null
    window.requestAnimationFrame(function(){
      if(!self) return
      if(!self._stayActive) self.css = {removeClass:val._val}
      else self.css = {addClass:val._val}
    })
  }

  doc.addEvent('move',exports._deactivate,id)
  doc.addEvent('up',exports._deactivate,id)
}

function shallowRaw (vobj) {
  var obj = {}
    , keys = vobj.keys
    , key
    , i = keys.length - 1
  for (; i >= 0; i--) {
    key = keys[i]
    obj[key] = vobj[key]
  }
  return obj
}

function initGrab (t, e, val, name) {
  if (!t[name] || !t[name]._e) t[name] = { _e: 0 }
  if (val[name]._val !== true) t[name].set('_e', shallowRaw(val[name]))
  return e[name] - (t[name]._e.val)
}

function grab (e, method, val, nested) {
  var t = val.bind && !nested ? val.bind.val : this
    , id = ( val.y 
      ? 'y' 
      : val.x 
        ? 'x' 
        : 'xy') 
        + 'Grab' 
        + (nested || '')
  if (t) {
    if (t._node) {
      var move = chooseMove(val, method)
        , startX = e.x
        , startY = e.y
        , ready
        , cX
        , cY
        , oldX
        , oldY
        , newX = startX
        , newY = startY
        , pass
        , upFn = function(e) {
            t.x._p = false
            t.y._p = false
            if (val.up && pass) {
              val.up._val.call(t, e, {
                x: newX - startX,
                y: newY - startY
              },
              { x: newX - oldX
              , y: newY - oldY
              })
            }
            events.click.block = false
            doc.removeEvent(false, id)
          }
      if (!val.x && !val.y){ //this needs revision
        val.x = {_val: true}
        val.y = {_val: true}
      }
      if (val.down) val.down._val.call(t, e, val);
      doc.addEvent('move', function(e) {
        oldX = newX
        oldY = newY
        newX = e.x
        newY = e.y

        events.click.block = true

        if (!ready) {
          pass = val.pass ? val.pass._val.call(t, e, {
            x: newX - startX,
            y: newY - startY
          }) : true
          if(!pass) {
            upFn(e)
            move = false
            doc.removeEvent(false, id)
          } else {
            e.preventDefault()
            if (val.x) {
              cX = initGrab(t, e, val, 'x')
              t.x._p = 1
            }
            if (val.y) {
              cY = initGrab(t, e, val, 'y')
              t.y._p = 1
            }
            if (val.start) val.start._val.call(t, e, val)
            ready = true
          }
        }else{
          e.preventDefault() //for android
          if (cX) t.x = { _e: newX - cX }
          if (cY) t.y = { _e: newY - cY }
          if (move) move.call(t, e, {
              x: newX - startX,
              y: newY - startY
            },val) //check for speed
        }
      }, id)
      doc.addEvent('up', upFn, id)
    } else {
      for (var i = t.length - 1; i >= 0; i--) {
        grab.call(t[i], e, method, val, i + 1)
      }
    }
  }
}
//add the events
events.drag = { val: { down: drag } }
events.grab = { val: { down: grab } }
events.active = { val: { down: active } }