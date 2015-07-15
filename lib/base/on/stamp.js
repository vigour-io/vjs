"use strict";

var Base = require('../')

var proto = Base.prototype
var define = Object.defineProperty

define(proto, '$stamp', {
	get: function getStamp() {

	var stamp = this.$on && this.$on.$change && this.$on.$change.$lastStamp

	return stamp

	},
	set: function setStamp() {

	}
})