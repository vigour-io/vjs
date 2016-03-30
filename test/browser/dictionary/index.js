require('../style.less')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , dict = require('../../../ui/dictionary')
  , Value = require('../../../value')
  , vObject = require('../../../object')

dict.bla = '!@#!@#!@#!@#!@#'

var bla = new Element({
  text: {
    dictionary: 'bla'
  }
})

app.add(bla)