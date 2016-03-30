require('../style.less')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/rooms')
    , require('../../../browser/network/cloud/datacloud')
    // , require('../../../browser/network/cloud/debug')
    )
  , util = require('../../../util')
  , debug = require('../../../util/debug')
  , Value = require('../../../value')
  , resource = require('../../../browser/network/resource')
  , pflag = require('../../../value/flags/process')
  , processx = require('../../../util/process')
  , frame = require('../../../browser/animation/frame')
  , cloud = c = new Cloud("ws://54.171.153.51:80")
  , vObject = require('../../../object')
  , Data = require('../../../data').inject(require('../../../data/selection'))
  , ua = require('../../../browser/ua')
  , events = e = require('../../../browser/events/windowFocus')
  , a

var g = new Element()
g.node.style.backgroundColor = 'pink'


app.add(g)
