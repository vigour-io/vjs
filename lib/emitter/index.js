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
    require('./queue'),
    require('./storage'),
    require('./trigger'),
    require('./clear'),
    require('./push'),
    require('./off'),
    require('./on'),
    require('./once'),
    require('./emit'),
    require('./condition')
  ],
  properties: {
    emitInstances: { val: true },
    emitContexts: { val: true }
  },
  useVal: true
}).Constructor
