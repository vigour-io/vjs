/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */

require('./style.less')
require('../../browser/animation/easing')

var Element = require('../../browser/element')
  , cases = require('../../browser/cases')
  , animation = require('../../browser/animation')
  , events = require('../../browser/events/advanced')
  , ua = require('../../browser/ua')
  , raf = require('../../browser/animation/raf')
  , eventUtils = require('../../browser/events/util')
  , app
  , _ios = ua.platform==='ios'
  , arr = ['phone','tablet','tv','desktop','ios','android','windows','mac','touch','slow'] //maybe make this configrable
  //ui/cases --
  , i = arr.length - 1

//hier process in requiren en added 'appStart' ofzoiets dergelijks

//add ook process aan base dingen dan word iets pas geadd na een bepaalde process update
//ultra mofo powerfull

cases.iosBrowser = _ios && ('standalone' in navigator && !navigator.standalone)
cases.iosFull = (!cases.iosBrowser&&_ios) || (_ios&&window.cordova) || false
cases.retina = window.devicePixelRatio > 1
cases.slow = (ua.platform === 'windows' && ua.device === 'phone') || (ua.noRaf&&ua.hasTransition) || _ios && (window.screen.height === (960 / 2)) || ua.device === 'tv'
cases.natvie = window.cordova
//packer case voor web // native

app = module.exports = new Element({
  'x,y':{val:0,clean:true,translate:true},
  node: document.body,
  w: window.innerWidth,
  h: window.innerHeight,
  css: 'app'
})

//if(cases.iosFull) {
  // app.y = {add:20}
  // app.h = {sub:20}
//}

var listener = function() {
  if(!app.blockResize) {
    // animation.prevent = true
    app.w.val = window.innerWidth
    app.h.val = window.innerHeight
    // animation.prevent = false
  } else {
    app.blockResize = false
  }
}

function defaultCase(str) {
  if(cases[str]===void 0) {
    cases[str] = (ua.device === str || ua.platform === str) ? true : false
  }
  app.css = {addClass:cases[str] ? str : 'not-'+str}
}

// listener = eventUtils.throttle(listener,60)
// listener =
// cases.noCalc = !util.hasCalc()
//case too see if app is running in a browser on ios (limits video capabilities)

if(cases.touch) events.document.addEvent('move',function(e) {
  if(!events._maybescroll && !events._setscroll) e.preventDefault()
},'app')

if('orientation' in window) window.addEventListener('orientationchange',listener)
if(!_ios) window.addEventListener('resize',listener)


//adding #<case> in url forces case, multiple hashes ==> multiple cases
//this is for testing purposes , add development indentifier for compiler

//this has to go
if(window.location.hash) {
  var hashCases = window.location.hash.split('#')[1]

  var x = hashCases.split(',')
  for(var j in x) {
    var y = x[j].split('=')
    ua[y[0]] = y[1]
  }

}

if(ua.device === 'tv') {
  cases.slow = true
}

for(;i >= 0;) defaultCase(arr[i--])



