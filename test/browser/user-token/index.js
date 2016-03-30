require('../style.less')

debug = require('../../../util/debug')


app = require('../../../ui/app')
      .inject( require( '../../../ui/app/values' ) )

app.node.style.overflow = 'scroll'

// app.url.val = { init: app.initialised } borken

var Element = require('../../../ui/element')
  , User = require('../../../ui/user')

app.user = new User()

