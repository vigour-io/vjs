/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var element = require('../').inject(require('../properties'))
  , events = require('../../events')
  , util = require('../../../util')
  , base = new element({
      node: 'video'
  })
  
module.exports = exports = base.Class
var video = exports
exports.base = base

base.setSetting(
{ name: '_videoSettings'
, new: function() {
    if (this.player.new) this.player.new.call(this)
  }
, remove:function() {
    if (this.player.remove) this.player.remove.call(this)
  }
, render:function() {
     if (this.player.render) this.player.render.call(this)
  }
})
//proxy adden --> should be an extension on src
base.node.setAttribute('webkit-playsinline', '')

//cloud shorten these 3 functions
function _vidEvents (val) {
  var t = this
    , e = (this.player || video.player).events
  val.each(function(i) {
    if (e[i] && e[i].set !== false) (e[i].set || e[i]).call(t, this, i)
  })
  return e
}

function _removeVidEvents (val) {
  var t = this
    , e = (this.player || video.player).events

  val.each(function(i) {
    if (e[i] && e[i].remove) e[i].remove.call(t, this, i)
  })
}

function _playHook (param) {
  var val = this.events
  if (val) {
    var t = this
      , e = (this.player || video.player).events
    val.each(function(i) {
      if (e[i] && e[i].play) e[i].play.call(t, this, i, param)
    })
  }
}

function _progress(val) {

  // console.error('SET progress',this._progress)

  if (!this._progress) {

      // console.error('SET progress for REAL',this._progress)

    //maybe do this with requestAnimationFrame -- danger lies in incosistency with timing
    var params = val
      , interval = params.interval && params.interval.val || 500 
      , fn = params._val
      , t = this
      , pr = (this.player || video.player).progress

    if (pr && pr.set) pr.set.call(t)

    t._progress = setInterval(function() {

      // console.log('before progress call!',t.src.val)
      // if(t.playing&&!t.__paused) {
      //   // t.play()
      //   // no src!
      // }

      var p = Number(t.getTime())
        , b = t.getBuffer(p)
        , d = Number(t.duration.val)

      if(d===1) d=0 //android fix -- maybe remove

      if (p >= 1 && d) {
        console.log('--->PAUSE!')
        t.pause()
        t.playing = false //should this be removed an go to end? 
        //call pause and set time in here?
        t.clearProgress()
      } else {

        if(t._stalled && d) { //just to make sure buffering always dissapaers    
          if(b>0.85 || (t.__lp && t.events.canplay && (p > t.__lp+(1/d)))) { //in seconds
            t._stalled = false
            t.events.canplay._val.call(t)
            t.__lp = null
          } else if( (!t.__lp) && p>-1) {
            t.__lp = p
          } 
        }

        if(!t.ignoreevents) fn.call(t, p, b)
      }
    }, interval)
  }
}

this._progress = _progress

exports.progress = 
{ play: function(i, p, pa) {
    if (pa) {
      _progress.call(this, this.events.progress)
    } else {
      this.clearProgress()
    }
  }
, set: function(val) {
    if (this.playing) _progress.call(this, val)
  }
, remove: function() {
    this.clearProgress()
  }
}

util.define(exports
, 'play', function(clear, ignore) {
    if (clear) delete this.ignoreevents
    if (!ignore && !this.ignoreevents && this.playing !== true) {
        this.playing = true
        _playHook.call(this, true)
    } else if(this.__paused && this.events.progress) {
      this.playing = true
      _progress.call(this,this.events.progress)
    }
    this.__paused = null
    ;(this.player || video.player).play.call(this, true)
  }
, 'pause', function(ignore) {
    if(ignore) this.ignoreevents = true

    if (!this.ignoreevents && this.playing !== false) {
      this.playing = false
      _playHook.call(this, false)
      if(this.events.pause) {
        this.events.pause._val.call(this)
      }
    } else {
      // alert('lets clear!')
      this.clearProgress()
      // _playHook.call(this, false)
    }

    this.__paused = true
    ;(this.player || video.player).play.call(this, false)
  }
, 'toggle', function(val) {
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }
, 'updateTime', function() {
    this._firstT = false
    exports.setTime.call(this, this.time)
  }
, 'getTime', function() {
    return (this.rendered && this.player || video.player).time.get.call(this, this.time) || 0
  }
, 'getBuffer', function(val) {
    return (this.rendered && this.player || video.player).buffer.call(this, val || 0)
  }
, 'clearProgress', function() {
    if (this._progress) {
      // console.log('remove that progress')
      clearInterval(this._progress)
      this._progress = null
      var pr = (this.player || video.player).progress
      if (pr && pr.remove) pr.remove.call(this)
    }
  }
)

base.extend(
{ name: 'player'
, type: false
, set: function(val) {
    util.setstore.call(this)
    this.__.player = val
    if (val.element) this.node = val.element
    if (this._class) this._class.prototype._.player = val
  }
, get: function(val) {
    return util.getStore.call(this, 'player') || video.player || {}
  }
}
, 
{ name: 'duration'
, set: function(val) {}
, get: function(val) {
    val._overwrite = (this.player || video.player).duration.call(this, val)
    return val
  }
}
, 
{ name: 'time'
, set: (exports.setTime = function(val) {
    if (!this._ignore) {

      val._overwrite = null
    
      var v = val.val
        , i = false

      if (v !== void 0) {
        if (!this._firstT || this._forceTime === true) { 
          v = Math.abs(v)
          i = true;
          this._firstT = true
          this._forceTime = null
        }

        if (v >= 0 && this.duration) {
          if(this.__lp) this.__lp = null
          ;(this.player || video.player).time.set.call(this, v * this.duration.val)
          if(this.events.seeking && !i)  this.events.seeking._val.call(this,v)
        }
      }
    }
  })
}
, 
{ autoplay: function(val) {
    (this.player || video.player).autoplay.call(this, val)
  }
, volume: function(val) {
    (this.player || video.player).volume.call(this, val)
  }
, src: function(val) {
    if(val.val!==this.___Src) {
      this.___Src = val.val
      if(this.events.src)  this.events.src._val.call(this,val)
      ;(this.player || video.player).src.call(this, val)
    }
  }
}
, 
{ name: 'events'
, "new": function() {
    _vidEvents.call(this, this.events)
  }
, remove: function() {
    _removeVidEvents.call(this, this.events)
  }
, set: function(val) {
  // console.log('EVENTS!')
    var a = util.arg(arguments)
    a[5] = _vidEvents.call(this, val)
    if(!a[5].seeking) a[5].seeking = {set:false}
    if(!a[5].src) a[5].src = {set:false}
    events._set.apply(this, a)
  }
})
