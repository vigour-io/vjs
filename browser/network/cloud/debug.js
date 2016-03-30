var util = require('../../../util')
  , debug = require('../../../util/debug')
  , log = debug.log.logger('Cloud', 'blue')

debug.level.Cloud = 3



module.exports = function() {
  var cloud = exports.cloud = this
    , __in__ = cloud.__in__
    , subscribe = this.constructor.prototype.subscribe
    , unsubscribe = this.constructor.prototype.unsubscribe
    , write = cloud.write

  cloud.write = function(data){
    if(typeof data !== 'string') log('writing:', log.parse(data))
    write.apply(this,arguments)
  }

    // console.log(this.constructor.pr)

  DEBUG$.cloud = this

  cloud.__in__ = function(data) {
    var lvl = debug.level.Cloud

    console.log('goddamn data!', JSON.stringify(data,false,2))

    // if(lvl) {
    //   console.group()
    //   log('got data:', log.parse(data))
    //   console.groupEnd()
    // }
    __in__.apply(cloud, arguments)
  }

  if(cloud.resubscribe){
    var _resubscribe = cloud.resubscribe
    cloud.resubscribe = function() {      
      log('resubscribe')
      cloud.subs.DEBUG$log()
      _resubscribe.call(cloud)
    }
  }

  this.subscribe =  function(subsobj, str) {
    if(debug.level.Cloud > 1) subsobj.DEBUG$log('subscribe', subsobj, str)
    subscribe.apply(this,arguments)
  }

  this.unsubscribe =  function(subsobj) {
    if(debug.level.Cloud > 1) subsobj.DEBUG$log('unsubscribe')
    unsubscribe.apply(this,arguments)
  }

  exports.msg = function(msg) {
    exports.cloud.__in__(msg)
  }
  
  cloud.on('welcome', function(clientid) {
    log('welcome', clientid)
  })

  cloud.on('open', function open() {
    log('open')
  })

  cloud.on('close', function() {
    log('close')
  })

  cloud.on('error', function(err) {
    log('cloud error', err)
  })

  cloud.on('reconnect', function() {
    log('reconnect')
  })

  cloud.on('reconnecting', function(opts) {
    log('reconnecting', opts.attempt, '/', opts.retries)
  })

  cloud.on('reconnected', function() {
    log('reconnected!!')
  })

  cloud.on('end', function() {
    log('end')
  })

  cloud.log = log
  // var label = 'Cloud'

  // function log(){
  //   if(debug.level.cloud > 0) {
  //     console.log.apply(console.log,[label.inverse.cyan].concat(util.arg(arguments)))
  //   }
  // }

} 