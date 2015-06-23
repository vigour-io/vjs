"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

/**
 * @memberOf Base#
 * @name  $origin
 * @type {base}
 */
define( proto, '$origin', {
  get:function() {
    var reference = this
    while( reference._$val instanceof Base ) {
      reference = reference._$val
    }
    return reference
  }
})

// var cnt = 0

define( proto, '$parseValue', {
  value:function( previousValue, origin ) {

    if(!origin) {
      origin = this
    }

    //now -- parsse operators by checking instance of or just check for $operator
    var val = this._$val
    if(val) {
      //special flag dat functie niet geget moet worden
      //dit is voor methods
      if( typeof val === 'function' ) {
        //make this into a funciton e.g. $execGetterFunction $bindGetter
        var context = this._$bind && this._$bind._$val || this
        if( context ) {
          if( typeof context === 'function' ) {
            //send val as well -- take previous val into account in $parseValue
            context = context.call(this, previousValue)
          } else if( context === '$parent' ) { 
            //this will be replaced with a general path functionality (that includes)
            context = this.$parent
          } else {
            context = this
          }
        }
        val = val.call(context, previousValue)
      } else if( val instanceof Base ) {
        // console.error(val)
        if(val !== origin) {
          // cnt++
          // if(cnt < 5000) {
            // console.log('--->',origin && origin.$path)
            val = val.$parseValue( void 0, origin )
          // }
        } else {
          console.error('parsingValue from same origin (circular)'
            , 'path:', this.$path
            , 'origin:', origin.$path
          )
          // return val
        }
      } else {
        val = this._$val
      }
    }

    if(val === void 0) {
      val = this
    }

    if(this.$Operator) {
      var operator = this.$Operator.prototype
      if( operator.$hasOperators( this ) ) {
        var operators = operator._$operators
        for( var key$ in this ) {
          if(operators[key$]) {
            var operator$ = this[key$]
            console.error('???')
            val = operator$._$operator.call( this, val, operator$, origin )
          }
        }
      }
    }

    return val
  }
})

/**
 * Returns the value of base object
 * @memberOf Base#
 * @name  $val
 * @type {*}
 */
define( proto , '$val', {
  get:function() {
    return this.$parseValue()
  },
  set:function( val ) {
    this.$set( val )
  }
})

define( proto, '$Operator', {
  value: require('./operator.js'),
  configurable:true 
})




