/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var value = require('../'),
    base = require('../base'),
    flags = require('../../object/flags');
    
    base.clonelist.push(['_flag', true]); //true clone!
    flags.extend(value);
    module.exports = value.flags;