var theUrl = require('vigour-js/lib/util/url/index.js')
var colors = require('colors-browserify') //eslint-disable-line
var Observable = require('vigour-js/lib/observable')

global.url = new theUrl.Constructor()

var a = global.bla = new Observable({
  val: 'yo'
})
var b = global.bla2 = new Observable('yo2')

url.set({
  search: 'searchit!',
  'hello': {
    separator: ',',
    indicator: '#',
    on: {
      data (data) {
        if(!this.val) {
          console.log('ok update my bitches! shit be gone!'.red)
        } else {
          console.log('data creepin!.'.white.bold.inverse, this.val)
        }
      }
    },
    val: a
  },
  '💩': {
    separator: ',',
    indicator: '#',
    on: {
      data (data) {
        if(!this.val) {
          console.log('ok update my bitches! shit be gone!'.red)
        } else {
          console.log('data creepin! burs'.magenta.inverse, data, this.val)
        }
      }
    },
    val: b
  },
  'no': {
    separator: ',',
    indicator: '#',
    on: {
      data (data) {
        if(!this.val) {
          console.log('ok update my bitches! shit be gone!'.red)
        } else {
          console.log('data creepin! burs'.magenta.inverse, data, this.val)
        }
      }
    },
    val: b
  }
})
