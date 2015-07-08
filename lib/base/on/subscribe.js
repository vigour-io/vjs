"use strict";

var define = Object.defineProperty
var Base = require('../index')
var proto = Base.prototype

var $subscribe = module.exports = function $subscribe(subsObj, listeners){
	var base = this

	console.error('$SUPSCRIBS', subsObj)

	subsObj.$each(function(){
		console.error('huppa subscribe to', this, 'in', base)
	})
}

define(proto, '$subscribe', {
	value: $subscribe
})