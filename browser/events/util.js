var raf = require('../animation/raf')
  , util = require('../../util')

exports.throttle = function(fn, frames, bind) {
  frames || (frames = 20) //~0.4sec
  var timer
    , arg
    , nobind = !bind
  return function() {
    arg = arguments
    if(nobind) bind = this
    if(!timer) {
      timer = frames
      raf(function repeat() {
        timer--
        if(!timer) {
          fn.apply(bind,arg) 
        } else {
          raf(repeat)
        }
      })
    }
  }
}

//TODO: postpone based on frames
exports.postpone = function(fn, time, bind) {
  time || (time = 200) //no raf!
  var timer
    , arg
    , nobind = !bind
  return function() {
    arg = arguments
    if(nobind) bind = this
    if(timer) clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(bind,arg)
    },time)
    return timer
  }
}

//TODO: test for leaks...
exports.interval = function(fn, frames, bind) {
  frames || (frames = 30) //~0.5sec
  var timer
    , clear
    , arg = util.arg(arguments,3)
  if(!timer) {
    timer = frames
    raf(function repeat() {
      timer--
      if(!timer) {
        timer = frames
        fn.apply(bind,arg)
      } 
      if(!clear) raf(repeat)
    })
  }
  return function() {
    clear=true
  }
}
