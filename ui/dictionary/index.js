/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 */

var util = require('../../util')
	, Element = require('../element')
	, Value = require('../../value')

//just sets a flag to a thing in the dictionary
Value.flags.dictionary = {
	set: function( val, stamp ) {
		var text = util.path( exports, val instanceof Array ? val : val.split('.') )
		//TODO: if not there add a listener to exports
		// -- listener has one array updates when nessevary
		this.val = text || 'DICTIONARY:'+val
	}
}

