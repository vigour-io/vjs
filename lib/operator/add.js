'use strict'
var Operator = require('./')

exports.properties = {
  $add: new Operator({
    key: '$add',
    operator: function (val, operator, origin) {
      // think about these arguments
      // console.log(arguments)
      return val + operator.parseValue(val, origin)
    }
  })
}
