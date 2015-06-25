var Operator = require('./')

module.exports = map = new Operator({
  $key:'$map',
  $operator:function( val, operator, origin ) {
    if(!this.$results) {
      this.$results = new Results({}, false ,this)
    }
    var arr = this.$results
    if(util.isPlainObj( val )) {
      forEach( val, function( field, key ) {
        arr.$setKey( key, operator._$val( field, key, false ) )
      })
    } else {
      val.$each(function( field, key ) {
        var result = operator._$val( field, key )
        if( result ) {
          
          //ff dingen weghalen ook hiero
          //only set this
          //different dan clear

          arr.$setKey( key, result, false )
        } else {
            
          // arr.$setKey( key, 'go away!' )
          console.log('===>REMOVE', key)
          //REMOVE KEY!

        }
      }, function(field) {
        return !operator._$operators[field]
      })
    }
    return arr
  }
})