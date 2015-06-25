"use strict";

var Base = require('../')
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

define( proto, '$parseValue', {
  value:function( previousValue, origin ) {

    if(!origin) {
      //origin is there for to gaurd for circular gets -- pretty heavy to do...
      origin = this
    }

    //whats important now is to integrate a seperate system to do val caching effectively
    //could also hook into events?
    //as long as event is not cleared -- have event available?
    //maybe weird

    //now -- parsse operators by checking instance of or just check for $operator
    var val = this._$val

    // if(val instanceof Base) {
    //   this._$cachedStamp = val._$cachedStamp
    // }

    // if(this._$cachedStamp && this._$cachedStamp === this._$lastChange ) {
    //   console.error('\n\n\n\nfound lval', this.$path, this._$cached, this._$cachedStamp ,this._$lastChange)
    //   if(!skipit) {
    //     return this._$cached
    //   }
    // }

    // console.info('exec $val getter', this.$path, this._$lastChange)

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
        if(val !== origin) {
          val = val.$parseValue( void 0, origin )
          
          // this._$lastChange = val._$cachedStamp
          
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
            // console.log( operator$ instanceof this.$Operator )
            // console.info('exec operator', operator$.$path, operator$, operator$._$operator)
            val = operator$._$operator.call( this, val, operator$, origin )
          }
        }
      }
    }

    // if(val._$lastChange) {
    //   console.info('---->yesh get from val?')
    //   this._$lastChange = val._$lastChange
    // }
    // this._$cachedStamp = this._$lastChange
    // console.warn('set $cachedStamp', val, this._$cachedStamp, this.$path, this._$lastChange)
    // this._$cached = val

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
  value: require('./operator'),
  configurable:true 
})
