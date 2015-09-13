var Observable = require('../observable')
var Operator = require('../operator')

module.exports = new Observable({
  $key:'api',
  $inject:require('../operator/shared'),
  $flags: {
    $parseResult: new Operator({
      // $inject:require('../operator/shared/setArray'),
      $key:'$parseResult',
      $operator:function( val, operator, origin ) {
        return this.$apiResult ? this.$apiResult.$val : void 0
      }
    })
  }
}).$Constructor
