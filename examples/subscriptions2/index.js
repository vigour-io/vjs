var define = Object.defineProperty

var Observable = require('../../lib/observable')

var SubsEmitter = require('../../lib/observable/subscribe/emitter')


var ding1 = new Observable({
  key1: 'val1',
  $on: {}
})
ding1._$key = 'rootding'

var subsEmitter = new SubsEmitter({
  hopla: function(event, meta) {
    console.group()
    console.error('SUBSEMITTER HANDLER FIRED!', meta)
    console.log('this:', this, '\n')
    console.log('meta:', meta, '\n')
    console.groupEnd()
  },
  $pattern: {
    any$: true
  }
}, false, ding1.$on)

ding1.set({
  $on: {
    durps: subsEmitter
  }
})

console.log('\n\n-------------- change key1!')

ding1.set({
  key1: 'chainge',
  key2: 'chainge2'
})

console.log('\n\n-------------- change key2!')

// ding1.key1.$val = 'lurk'

ding1.set({
  // key1: 'lurk',
  key2: 'lark',
  // wex: true
})



// ding1.key1.$val = false

// console.log('\n\n-------------- go fire dat boy')

// ding1.set({
//   ha: true
// })
