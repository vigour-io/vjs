// operator.js
var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

var operator = new Base({
  $bind:'$parent',
  $flags: {
    $operator: function(val) {
      //wrap funky stuff here
      this._$operators[this._$key] = true
      this._$operator = val
    }
  }
})

define( operator, '$hasOperators', {
  value: function( base ) {
    for(var key$ in this._$operators) {
      if(base[key$]) {
        return true
      }
    }
  }
})


operator._$operators = {}

var Operator = module.exports = operator.$Constructor 

// define( operator, '$ChildConstructor', {
//   value: Operator
// })

//val is val of its parent, operator is its own maybe add key in $flags helper?
//testing!
proto.$flags = {
  $add:new Operator({
    $key:'$add',
    $operator:function( val, operator ) {
      return val + operator
    }
  }),
  $transform:new Operator({
    $key:'$transform',
    $operator:function( val, operator ) {
      //maybe make it easier if !_$operator just return $val ?
      return operator
    }
  })
}

//fix those operators

//how to do it
//wtf????
//for(var i = 0 ; i < len; i++)


//check for if( _$operator )
