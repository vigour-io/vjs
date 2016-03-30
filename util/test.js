var isNode = require('./').isNode //has to become part of util
  , _test = function (method, name, complete, call, args, nolog) {
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
      console.log( 
        name + '\nparse time: ' 
        + ((end - start) / 1000) 
        + ' sec' + (mem ? '\nmemory used (approximate): ' 
        + mem + ' bytes' : '')
      )
    }
    return time
  }

module.exports = exports = function (params, fn) {
  if (fn && typeof params === 'string') {
    return _test(fn, params)
  } 
  else if (typeof params === 'function') {
    return _test(params)
  } 
  else if (params instanceof Object) {
    if (params.loop) {
      //testing memory in loop is hard since the gc almost never makes it before next iteration;
      var time = []
        , mem = []
        , callback = function (_time, memory) {
          time.push(_time);
          if (memory) {
            mem.push(memory);
          }
        }

      for (var i = params.loop; i > 0; i--) {
        _test(params.method, false, callback)
      }

      if (params.complete) {
        params.complete(time, mem, params.name)
      } 
      else {
        console.log(
          params.name 
          + ' n=' + params.loop 
          + '\nparse time:' 
          + (params.extensive 
            ? (' \n\n' + time.join(' sec\n') + ' sec\n\n') 
            : '') 
          + 'average: ' + exports.average(time)[1] 
          + ' sec\ntotal: ' 
          + exports.average(time)[0] + ' sec')
        //+(mem.length>0 ? '\nmemory used (approximate): '+mem+' kb' : '');
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

exports.text = function (length, fn, str, nolines, strict) {
  if (fn) {
    return function() {
      return exports.text(
        Math.round(Math.random() * length) + 1, false, str, nolines, strict
      )
    }
  } 
  else {
    var s = ['.', '.', '.', ';', ',']
      , b = ['ab', 'able', 'zo', 'x', 'lax', 'bur', 'rem', 'lur', 'fur', 'jur', 'lex', 'rex', 'wurd', 
        'shur', 'burn', 'heps', 'a', 'i', 'y', 'u', 'e', 'p', 'l', 'splurf']
      , output = ''
      , nospace = 0

    if (str) b = str

    str = function () {
      return b[Math.round(Math.random() * (b.length - 1))]
    }

    if (!length) length = ~~ (Math.random() * 101)

    for (var i = 0, g; i < length; i++) {
      if ( !strict && (!output[output.length - 1] 
        || output[output.length - 2] === '.' 
        || output[output.length - 2] === '\n')
      ) {
        g = str()
        output += g[0].toUpperCase() + g.slice(1)
      } 
      else {
        output += str()
      }
      nospace++
      if (!strict && ~~(Math.random() * (nospace / 2))) {
        var br = false
          , v
        if (!nolines && ~~(Math.random() * 21) > 17) {
          v = s[~~(Math.random() * (s.length - 1))]
          output += v
          if (v === '.' && ~~(Math.random() * 11) > 6) {
            br = true
            output += '\n'
            if (~~(Math.random() * 11) > 7) output += '\n';
          }
        }
        if (!br) output += ' '
        nospace = 0
      }
    }
    return output
  }
}

Object.defineProperty(module.exports, 'domain', {
  get: function() {
    //debugger --- can go away with a transform
    return String(window.location)
      .match(/https?:\/\/([^\/]+)/)[1]
      .replace(/:.+/, '')
  }
});

exports.data = function (populate, level, obj, cnt, prev) {
  if (!obj) obj = {}
  if (!cnt) cnt = 0
  if (!level) level = 0

  for (var i in populate) {
    if ((populate[i] instanceof Object) 
      && populate[i].length && populate[i].val
    ) {
      if (populate && populate[i]) {
        obj[i] = []
        for (var j = 0; j < populate[i].length; j++) {
          obj[i][j] = typeof populate[i].val === 'function' 
            ? populate[i].val() 
            : exports.data(populate[i].val, (level + 1), false, j + 1, obj)
        }
      }
    } 
    else if ((populate[i] instanceof Object) 
      && (typeof populate[i] !== 'function')
    ) {
      obj[i] = exports.data(populate[i], (level + 1), obj[i], false, cnt, obj)
    } 
    else if (populate && populate[i]) {
      obj[i] = (typeof populate[i] === 'function') 
      ? populate[i].call(obj, cnt, prev) 
      : populate[i];
    }
  }
  return obj;
};

if (!isNode) 
  console.log('util/test \n\nif you want to check memory usage start chrome using: \n\n open -a Google\\ Chrome --args --enable-memory-info \n');