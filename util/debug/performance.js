var util = require('../') 
  , debug = require('./') 
  , isNode = util.isNode //has to become part of util
  , os

if (isNode) { 
  os = require('os')
} else {
  console.log('DEBUG \n\nif you want to check memory usage start chrome using: \n\n open -a Google\\ Chrome --args --enable-memory-info --js-flags="--expose-gc"\n'.grey)
}

function _test(method, name, complete, call, args, nolog) {
  var start = exports.now()
    , memorystart = exports.memory()
    , memoryend
    , mem
    , time
    , end
    , sub 
  if (!name) name = 'TEST PERFORMANCE'
  if (call) {
    sub = method.apply(call, args)
  } 
  else {
    sub = method.apply(this, args)
  }
  end = exports.now()
  memoryend = exports.memory()
  mem = (memoryend - memorystart)
  time = end - start - (sub || 0)
  if (complete) {
    complete(((time) / 1000), (memoryend - memorystart))
  } 
  else if (!nolog) {
    if(debug.level.test>0) {
      console.log( 
        name.inverse , '\nparse time: ' 
        + ((end - start) / 1000) 
        + ' sec' + (mem ? '\nmemory used (approximate): ' 
        + mem + ' bytes' : '')
      )
    }
  }
  return time
}

debug.countListeners = function(obj, amount) {
  var amount 
  if(!amount) amount = {val:0}
  if(obj._listeners) {
    amount.val+=obj._listeners.length
  }
  obj.each(function(i) {
    debug.countListeners(this,amount)
  })
  return amount.val
}

function _done(params, time, mem) {
  if (params.complete) {
    params.complete(time, mem, params, exports.average(time)[0], exports.average(time)[1])
  } else {
    if(debug.level.test>0) {
      console.log(
        params.name.inverse 
        , ' n=' + params.loop 
        + '\nparse time:' 
        + (params.extensive 
          ? (' \n\n' + time.join(' sec\n') + ' sec\n\n') 
          : '') 
        + 'average: ' + exports.average(time)[1] 
        + ' sec\ntotal: ' 
        + exports.average(time)[0] + ' sec')
    }
    //+(mem.length>0 ? '\nmemory used (approximate): '+mem+' kb' : '');
  }
}

module.exports = exports = function (params, fn) {
  if (fn && typeof params === 'string') {
    return _test(fn, params)
  } 
  else if (typeof params === 'function') {
    return _test(params)
  } 
  else if (params instanceof Object) {
    if(!params.name) params.name = 'performance test'

    if (params.loop) {
      //testing memory in loop is hard since the gc almost never makes it before next iteration;
      var time = []
        , mem = []
        , callback = function (_time, memory) {
          time.push(_time)
          if (memory) mem.push(memory)
        }

      if(params.interval) {
        var cnt = 0
          , interval = setInterval(function() {
              cnt++
              if(cnt===params.loop-1) {
                 clearInterval(interval)
                 _done(params, time, mem) 
              } else {
                _test(params.method, false, callback)
              }
            },params.interval)
      } else {
        for (var i = params.loop; i > 0; i--) {
          _test(params.method, false, callback)
        }
        _done(params, time, mem) 
      } 
      return exports.average(time)
    } 
    else {
      return _test(params.method
        , params.name
        , params.complete
        , params.call
        , params.args
        , params.nolog)
    }
  }
}

if(debug.log) debug.log.default('test', 4)

exports.now = function () {
  return isNode
    ? process.hrtime()[0] * 1000 + process.hrtime()[1] * 0.000001 
    : (window.performance && window.performance.now 
      ? window.performance.now() 
      : new Date().getTime())
}

exports.memory = function () {
  return isNode 
    ? process.memoryUsage().heapUsed 
    : (window && window.performance && window.performance.memory 
      ? window.performance.memory.usedJSHeapSize * 0.000976562 
      : 0)
}

exports.average = function (array) {
  var number = 0
  for (var i = array.length - 1; i >= 0; i--) {
    number += array[i]
  }
  return [number, number / array.length]
}
