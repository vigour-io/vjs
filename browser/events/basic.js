/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var events = module.exports = require('./')
  , cases = require('../cases')
  , util = require('../../util')
  , ua = require('../ua')

cases.touch =
( ( 'ontouchstart' in window )
  || window.DocumentTouch
  && document instanceof DocumentTouch
)
|| navigator.msMaxTouchPoints
|| false

function _basic(e, method, val) {
  e.x = e.pageX
  e.y = e.pageY
  method.call(this, e, val)
}

events.down =
{ touch:
  { touchstart: function(e, method, val) {
      if(events.down.block) return
      var targetTouches = e.targetTouches[0]
      e.x = targetTouches.pageX
      e.y = targetTouches.pageY
      method.call(this, e, val)
    }
  }
  , val: { mousedown: function(e, method, val){
      if(e.which!==1 || events.down.block) return
       _basic.call(this,e, method, val)
    }
  }
}

//right-down
events.rdown =
{ touch:
  { touchstart: function () {
      //2 fingers?
    }
  }
, val:
  { mousedown: function (e, method, val) {
      if(e.which===3) {
        document.oncontextmenu = function() { return false }
        e.preventDefault()
        // e.rdown = true
        _basic.call(this,e,method,val)
        setTimeout(function() { document.oncontextmenu = false }, 0)
      }
    }
  }
}

//move
events.move = {
  touch:
  { touchmove: function (e, method, val) {
      var targetTouches = e.targetTouches[0]
      e.x = targetTouches.pageX
      e.y = targetTouches.pageY
      method.call(this, e, val)
      // document.write(e.targetTouches[0].pageX);
    }
  }
  , val: {
    mousemove: _basic
  }
}

//up
events.up = {
  touch: {
    touchend: function(e, method, val) {
      var ct = e.changedTouches
      e.x = ct[0].pageX
      e.y = ct[0].pageY
      method.call(this, e, val)
    }
  },
  val: {
    mouseup: _basic
  }
}

//click
events.click = {
  val: {
    down: function(e, method, val) {
      var t = this
        , name = 'click'
      if(!events.click.block){
        t.addEvent('up', function(e) {
          t.removeEvent('up', name)
          var ms = events._maybescroll
          if(ms){
            if(ms.length) events._maybescroll.unshift([method,t])
            else events._maybescroll = [[method,t]]
          }else if(!events.click.block) method.call(t, e, val)
        }, name);
        setTimeout(function() {
          t.removeEvent('up', name)
        }, 300)
      }
    }
  }
}

events.rclick = {
  val: {
    rdown:events.click.val.down
  }
}

//clickout cannot be used to create complex events! it's too custom

util.define
( events
, '_out'
, { value: [] }
, '_keyboard'
, { value:[] }
)

events.keyboard = {
  create: function() {
    var exec = function(e) {
       if (this.rendered) this.events.keyboard._val.call(this, e);
    }
    events.document.addEvent('keyup', function(e) {
      for (var arr = events._keyboard, i = arr.length - 1; i >= 0; i--) {
        exec.call(arr[i],e)
        if (arr[i]) arr[i].eachInstance(exec, 'events', e)
      }
    },'keyboard')
  },
  add: function() {
    this.setSetting({
      name: '_keyboard',
      remove: events.keyboard.remove
    })
    if (!util.checkArray(events._keyboard, this)) {
      events._keyboard.push(this)
    }
  },
  remove: function() {
    var index = util.checkArray(events._keyboard, this, true);
    if (~index) {
      events._keyboard.splice(index, 1)
      this.removeSetting('_keyboard')
    }
  }
}

var _outRemove = function() {
    var index = util.checkArray(events._out, this, true)
    if (~index) {
      events._out.splice(index, 1)
      this.removeSetting('_out', _outSetting)

      // debugger

    }
  }
, _outSetting = {
  name: '_out',
  render: function() {
    if (!util.checkArray(events._out, this)) {
      events._out.push(this)
    }
  },
  remove: _outRemove
}

events.out = {
  create: function() {
    this.m = true;
    events.document.addEvent('up', function(e) {

      var base = e.target,
        exec = function() {
          var p = base
            , t
          while (p && !t) {
            if (p.base && this === p.base) {
              t = true;
            } else {
              p = p.parentNode;
            }
          }
          if (!t && this.rendered) this.events.out._val.call(this, e)
        }
      for (var arr = events._out, i = arr.length - 1; i >= 0; i--) {
        exec.call(arr[i])
        if (arr[i]) arr[i].eachInstance(exec, 'events')
      }
    },'out')
  },
  add: function() {
    var t = this
     // events._out.push(this)
    this.setSetting(_outSetting)
  },
  remove:_outRemove
};