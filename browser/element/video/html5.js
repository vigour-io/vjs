/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
//duration in a V.Value --> update if nessecary?
var ua = require('../../ua')
  , video = require('./')
  , postpone = require('../../../browser/events/util').postpone
  , _winPhone = ua.platform === 'windows' && ua.device === 'phone'
  , _ios = ua.platform === 'ios'
  , _android = ua.platform === 'android'
  , _canplay = 'canplay' 

function createListener () {
  var a = arguments
    , l = a.length
  return function(val) {
    for (var i = 0, t = this; i < l; this.node.addEventListener(a[i++]
      , function(e) { val._val.call(t,e) }));
  }
}

function _canplayListener () {
  if (!this._canplay && !_winPhone) { //later versions (if fixedin 9)
    this._canplay = true
    var t = this
    
    function canPlay() {
      if (t.time) {
        if (!t.time.val) this._firstT = true
          //fixes for phonegap! windowsmobile
        if (_android && ua.browser !== 'chrome') { 
          //and special browser!; check firefox; //identify more browsers that do not need this crap
          var tries = 0
          clearInterval(t._timeFixInterval)
          t._timeFixInterval = setInterval(function() {
                t.updateTime()
                if (tries === 3) {
                  t._canplay = null
                  clearInterval(t._timeFixInterval)
                }
                if (t.node.duration !== 1) { //android sets duration to 1 as default instead of 0
                  tries++
                  if (t.playing) t.node.play()
                }
              }, 200)
        } else {
          if (t.time.val) {
            if (_ios) {
              setTimeout(function() { t.updateTime() }, 0)
            } else {
              t.updateTime()
            }
          } else {
            t._forceTime = true 
          }
          t._canplay = null
        }
      }
      t.node.removeEventListener(_canplay, canPlay)
    }
   
    this.node.addEventListener(_canplay, canPlay)
  }
}

function setTime (val) {
  if (this.node.readyState) {
    this.node.currentTime = val
    if (_ios) this._correctTime = val
  } else {
    _canplayListener.call(this)
  }
}

module.exports = 
{ progress: {
    set: function() {
      var t = this;
      t.node.addEventListener('end', (t._prEnd = function() {
        t.clearProgress()
      }))
    },
    remove: function() {
      this.node.removeEventListener('canplay')
      this.node.removeEventListener('end', this._prEnd) //maybe no play and pause!;
    }
  }
, buffer: function(val) {
    if (this.node.buffered) {
      var l = this.node.buffered.length
        , piv = -1
        , t = this.node.currentTime || 0
        , ls
        , tt
        , i = 0
      
      for (; i < l; i++) {
        ls = this.node.buffered.start(i)
        if (ls > piv && ls < t) {
          piv = i
          tt = ls
        } else {
          break
        }
      }
      if (piv > -1) {
        piv = this.node.buffered.end(piv)
        return piv < t ? 0 : piv / this.duration.val
      } else {
        return 0
      }
    }
    return 0
  }
, play: function(val) {
    if (val) {
      this.node.play()
    } else {
      this.node.pause()
    }
  }
, time: 
  //tests for android , winphone, firefoxphone (seeking on winphone is not possible anyways)
  { set: _ios  || _android //ua.device === 'phone' || ua.device === 'tablet'
      ? postpone(setTime)
      : setTime
  , get: function(val) {
      var time = this._node && this.node.currentTime
      if (this._correctTime) {
        if (this._correctTime > time - 2 && this._correctTime < time + 2) { //|| this.cnt
          time = this._correctTime
          if (!this.cnt) {
            this.cnt = 3
          } else if (this._cnt < 2) {
            this._correctTime = false
            this._cnt = false
          } else {
            this._correctTime+=0.5 //should be interval of progress updates
            this._cnt--
          }
        } else {
          time = this._correctTime
        }
      }
      return time / this.duration.val || val.val
    }
  }
, duration: function(val) {
    if (this.node.readyState) {
      return this.node.duration
    } else {
      return val && val.val
    }
  }
, autoplay: function(val) {
    this.node.autoplay = val.val
  }
, volume: function(val) {
    this.node.volume = val.val
  }
, "new": function() {
    this.addEvent('down',function(e){ e.preventDefault() })
    _canplayListener.call(this)
    if (this.volume) this.volume.update(this)
  }
, events: {
    pause:function(val) {
      var t = this
      if(_ios) { 
       t.node.addEventListener('pause', function(e) {
         if(!t.ignoreevents) t.pause()     
       })
      }
    }
  , progress: video.progress
  , ready: createListener('loadedmetadata')
  , canplay: function(val) {
      var t = this
      t.node.addEventListener(_canplay, function(e) {
        if(t.node.readyState===4) {
          t._stalled = false
          val._val.call(t,e)
        }
      })
    }
  , stalled: function(val) {
      var t = this
        , listen = function(e) {
          var time = t.getTime()
          if(!(t.getBuffer(time)-time > 0.05)) {
            t._stalled = true
            val._val.call(t,e)
          }
        }
      t.node.addEventListener('stalled', listen )
      t.node.addEventListener('waiting', listen )
    }
  , play: 
    { play: function() {
        if (this.events.play) this.events.play._val.call(this)
      }
    , set: false
    }
  , end: createListener('ended')
  }
, src: function(val) {
    if (this.node.src !== val || val || !val && this.node.src) this.node.src = val.val
  }
}

if (!video.player) video.player = module.exports
