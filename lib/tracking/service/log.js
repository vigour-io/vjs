'use strict'
exports.services = {
  log: function (obj) {
    console.log('%cTRACKER LOGGER:', 'color:white;background:#333;',
    obj)
    // console.log(
    //   obj.convert({
    //     plain: true
    //   }))
  }
}

// GA, Omnitue, Logger, RickService
// plugin voor de emitter is iets war args moet consument (b.v google analytics plugin >
// bv event key > ID > payload (value > true false errormessage > eventobject zoals change
// id en dit is de originator van het event))
// plugin eerste logger > in de console.log mn tracking info
// if key === error > parse error object
// object maken dat shit logt
// args definen zijn altijd hetzelfde voor elke plugin
