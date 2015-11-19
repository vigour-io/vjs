var Emitter = require('../../lib/emitter')
var Event = require('../../lib/event')
Event.prototype.inject(require('../../lib/event/toString'))

var a = new Emitter()

// var Observable = require('../../lib/emitter')


// a.on(function(data, event ) {
//   // console.log(data, event.toString())
// })

function valerio(data, event, arg, arg2) {
  // console.log('')
  console.log('data -->', data, 'event -->', event, 'arg -->', arg(), 'arg2-->', arg2)
}

a.on([valerio, function testing() {
  console.log('hello!');
}, 'xxxx'])

// a.on([valerio, 'xxxxxxxxxxxxx!', 'hello2'])


a.emit('xxx')
// a.emit('fewefw')
// a.emit('erwfewefwfew')


var Observable = require('../../lib/observable/')

var obs = new Observable()

console.log('------------------- EV + OBS')
var event = new Event(obs, 'data')
a.emit('cccc', event)

console.log(event)

event.isTriggered = true
event.trigger()

console.log('------------------- OBS')
var b = new Observable({
  on: {
    data: function(data, event) {
      console.log('xxxx')
      this.set( Math.random()*99999, event)
    }
  }
})

b.val = 'a'


console.log('------------------- OBS-2')
var x = new Observable({
    key:'x',
    on: {
      data:function(data, event) {
        console.info(event.toString())
      }
    }
})



var d = new Observable({
  key:'d',
  on: {
    data: function(data, event) {
      x.set(Math.random()*999, event)
      c.set('test')
    }
  }
})



var c = new Observable({
  key:'c'
})
c.on('data', d)

c.val = 'a'
