var repl = require('repl')
  , context = repl.start({ prompt: '> ', useGlobal: true }).context

var VObject = context.VObject = require('../../object')

var thing = context.thing = new VObject({obj:{fe:{test:true}}, empobj:{}})

