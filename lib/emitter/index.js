'use strict'
var Base = require('../base')

/**
 * @namespace Emitter
 * @class
 * @augments base
 * @param  {*} val
 *  difference with base -- sets listeners for each key
 *  if there is a function will set a listener on fn val
 * @return {base}
 */
module.exports = new Base({
  inject: [
    require('./storage'),
    // require('./condition'),
    require('./execute'),
    require('./push'),
    require('./off'),
    require('./on'),
    require('./emit')
  ],
  properties: {
    secondary: { val: true },
    executeQueue: { val: true },
    executeInstances: { val: true },
    executeContext: { val: true }
  },
  useVal: true,
  define: {
    emitInternal: function (event, bind, meta) {
      this.push(bind, event.push(this))
    }
  }
}).Constructor
