// perf.js
var isNode = (typeof window === 'undefined')
  , os

var util = {
  checkArray : function (list, val, index, field) {
    var arr = index instanceof Array
    if(!list) return false
    for (var i = 0, l = list.length, t; i < l; i++) {
      t = list[i]
      if (index !== void 0) {
        if (index === true) {
          if (t === val) return i
        } else if (t[index] === val) return field ? t : i
      } else {
        if (t === val) return true
      }
    }
    return false
  }
}

if (isNode) { 
  os = require('os')
} else {
  console.log('DEBUG \n\nif you want to check memory usage start chrome using: \n\n open -a Google\ Chrome --args --enable-precise-memory-info --enable-memory-info --js-flags="--expose-gc"\n')
}

function _test(method, name, complete, call, args, nolog, logger) {
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
      (logger || console.log)( 
        name , '\nparse time: ' 
        + ((end - start) / 1000) 
        + ' sec' + (mem ? '\nmemory used (approximate): ' 
        + mem/1024 + ' mb' : '')
      )
  }
  return time
}


function _done(params, time, mem, memstart) {
  if (params.complete) {
    params.complete(time, mem, params, exports.average(time)[0], exports.average(time)[1])
  } else {

      // console.log('????')


      // var memobj = {
      //   totalJSHeapSize:window.performance.memory.totalJSHeapSize * Math.pow(0.000976562,2)+'mb' ,
      //   usedJSHeapSize:window.performance.memory.usedJSHeapSize * Math.pow(0.000976562,2) +'mb'
      // }


      // var memtotal = memstart ? memstart-exports.memory() : 0

      (params.log || console.log)(
        params.name 
        , ' n=' + params.loop 
        + '\nparse time:' 
        + (params.extensive 
          ? (' \n\n' + time.join(' sec\n') + ' sec\n\n') 
          : '') 
        + 'average: ' + exports.average(time)[1] 
        + ' sec\ntotal: ' 
        + exports.average(time)[0] + ' sec\n'
        // + (mem.length>0 ? '\nmemory used (approximate): '+mem+' kb' : '')
        // + (memstart ? 'total memory used (entire app): ' + JSON.stringify(memobj,false,2) : '')
      );
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

      var memstart = exports.memory()
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
                 _done(params, time, mem, memstart) 
              } else {
                _test(params.method, false, callback)
              }
            },params.interval)
      } else {
        for (var i = params.loop; i > 0; i--) {
          _test(params.method, false, callback)
        }
        _done(params, time, mem, memstart) 
      } 
      return exports.average(time)
    } 
    else {
      return _test(params.method
        , params.name
        , params.complete
        , params.call
        , params.args
        , params.nolog
        , params.log
        )
    }
  }
}

exports.now = function () {
  return isNode
    ? process.hrtime()[0] * 1000 + process.hrtime()[1] * 0.000001 
    : (window.performance && window.performance.now 
      ? window.performance.now() 
      : new Date().getTime())
}

exports.memory = function () {
  return isNode 
    ? process.memoryUsage().heapUsed * 0.000976562  
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
