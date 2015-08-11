var s = {
  title: 'margin: 5px; color:blue; font-size: 16pt'
}

// ==============================

var define = Object.defineProperty

var Observable = require('../../lib/observable')
var SubsEmitter = require('../../lib/observable/subscribe/emitter')

// ==============================


var ding1 = new Observable({
  key1: 'val1',
  $on: {}
})
ding1.$key = 'rootding'

var subsEmitter = new SubsEmitter({
  hopla: function(event, meta) {
    console.error('SUBSEMITTER HANDLER FIRED!', meta)
    console.group()
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

console.log('%c-------------- change 1!', s.title)

ding1.set({
  key1: 'chainge',
  key2: 'chainge2'
})

console.log('%c-------------- change 2!', s.title)

ding1.key2.$val = 'lufe'

// ding1.set({
//   // key1: 'lurk',
//   key2: 'lark',
//   // wex: true
// })



// ding1.key1.$val = false

// console.log('\n\n-------------- go fire dat boy')

// ding1.set({
//   ha: true
// })
