require=function e(t,s,i){function r(o,a){if(!s[o]){if(!t[o]){var u="function"==typeof require&&require;if(!a&&u)return u(o,!0);if(n)return n(o,!0);var c=Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var h=s[o]={exports:{}};t[o][0].call(h.exports,function(e){var s=t[o][1][e];return r(s?s:e)},h,h.exports,e,t,s,i)}return s[o].exports}for(var n="function"==typeof require&&require,o=0;i.length>o;o++)r(i[o]);return r}({"/Users/jim/dev/vjs/examples/index.js":[function(t){t("../lib/base")},{"../lib/base":"/Users/jim/dev/vjs/lib/base/index.js"}],"/Users/jim/dev/vjs/lib/base/index.js":[function(t,e,s){"use strict";e.exports=s=function(t,e){e&&(this._$g=e),t&&this.$set(t)};var i=s.prototype,r=Object.defineProperty;r(i,"$fromBase",{get:function(){return this.__proto__}}),r(i,"$children",{value:{$d:s},writable:!0}),r(i,"$getVal",{value:function(){}}),r(i,"$val",{get:function(){return this.$getVal()},set:function(){}}),r(i,"$set",{value:function(t){if(t instanceof Object)for(var e in t)this.$setKey(e,t[e]);else this._$val=t}}),r(i,"$f",{value:function(t,e,s){s?s._$g!==this?this[t]=new s.$d(e,this):s.$set(e):(this[t]=new this.$children.$d(e,this),this[t]._$b=t,this.hasOwnProperty("_$d")&&this.$e.call(this,t))}}),r(i,"$setKey",{value:function(t,e){var s="_"+t,i=this[s];i?this.$f(s,e,i):this.$f(t,e,this[t])}}),r(i,"$d",{set:function(){},get:function(){if(!this.hasOwnProperty("_$d")){for(var t in this)"_"===t[0]||this["_"+t]||this.$e.call(this,t);r(this,"_$d",{value:function(t,e){e&&(this._$g=e),t&&this.$set(t)}}),this._$d.prototype=this}return this._$d}}),t("./util"),t("./path")},{"./path":"/Users/jim/dev/vjs/lib/base/path.js","./util":"/Users/jim/dev/vjs/lib/base/util.js"}],"/Users/jim/dev/vjs/lib/base/path.js":[function(t){"use strict";var e=t("./index.js"),s=Object.defineProperty,i=e.prototype;s(i,"$e",{value:function(t){this["_"+t]=this[t];for(var e in this[t])"_"===e[0]||this[t]["_"+e]||this[t].$e(e);s(this,t,{get:function(){var e=this["_"+t];return this.hasOwnProperty("_"+t)?this._$h?(e._$=this._$.concat([t]),e._$h=this._$h):(e._$=null,e._$h=null):(e._$h=this,e._$=[t]),e},set:function(e){this["_"+t]=e}})}}),s(i,"$g",{get:function(){return this._$&&1===this._$.length?this._$h:this._$g},set:function(t){this._$g=t}}),s(i,"$path",{get:function(){for(var t=[],e=this;e&&e._$b;)t.unshift(e._$b),e=e.$g;return t}})},{"./index.js":"/Users/jim/dev/vjs/lib/base/index.js"}],"/Users/jim/dev/vjs/lib/base/util.js":[function(t){"use strict";var e=t("./index.js"),s=e.prototype,i=Object.defineProperty;i(s,"$convert",{value:function(){var t={};for(var e in this)"_"!==e[0]&&(t[e]=this[e].$convert&&this[e].$convert()||this[e]);return this._$val&&(t.$val=this._$val),t}}),i(s,"$toString",{value:function(){return JSON.stringify(this.$convert(),!1,2)}}),i(s,"$keys",{get:function(){var t=[];for(var e in this)t.push(e);return t}})},{"./index.js":"/Users/jim/dev/vjs/lib/base/index.js"}]},{},["/Users/jim/dev/vjs/examples/index.js"]);