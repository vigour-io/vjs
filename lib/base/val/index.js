"use strict";

var Base = require('../')

Base.prototype.$define = {
  /**
   * @memberOf Base#
   * @name  $origin
   * @type {base}
   */
 $origin: {
    get:function() {
      var reference = this
      while( reference._$val instanceof Base ) {
        reference = reference._$val
      }
      return reference
    }
  },
  $parseValue: function( previousValue, origin ) {
    if(!origin) {
      origin = this
    }
    var val = this._$val

    if(val) {
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
        if(val !== origin) {
          val = val.$parseValue( void 0, origin )          
        } else {
          console.error(
            'parsingValue from same origin (circular)',
            'path:', this.$path,
            'origin:', origin.$path
          )
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
            val = operator$._$operator.call( this, val, operator$, origin )
          }
        }
      }
    }

    return val
  },
  /**
   * Returns the value of base object
   * @memberOf Base#
   * @name  $val
   * @type {*}
   */
  $val: {
    get:function() {
      return this.$parseValue()
    },
    set:function( val ) {
      this.$set( val )
    }
  },
  $Operator: require('./operator')
}
