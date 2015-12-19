'use strict'
// var url = require('../../../lib/util/url/index.js')
var Observable = require('../../../lib/observable/')
var colors = require('colors-browserify') //eslint-disable-line

// window.location.hash = ',😸'

describe('Observable properties should update URL', function () {
  // it('should update window location pathname when setting Observable.pathname.val', function () {
  //   url.pathname.val = '/shows/de-slimste-mens/seizoen-1/aflevering-2'
  //   expect(url.pathname.val).to.equal(window.location.pathname)
  // })
  // it('should update window location href when setting Observable.pathname.val', function () {
  //   expect(url.href.val).to.equal(window.location.href)
  // })
  // it('should update window location hash when setting Observable.hash.val', function () {
  //   url.hash.val = '#lol'
  //   expect(url.hash.val).to.equal(window.location.hash)
  // })
  // it('should update window location search when setting Observable.search.val', function () {
  //   url.hash.val = '#lol'
  //   expect(url.hash.val).to.equal(window.location.hash)
  // })

  var Event = require('../../../lib/event')

  var theUrl = new Observable({
    inject: [
      require('../../../lib/operator/type'),
      require('../../../lib/operator/transform')
    ],
    on: {
      new: {
        popstate () {
          this._internal = () => {
            var event = new Event(this, 'popstate')
            event.isTriggered = true
            this.href.emit('data', window.location.href, event)
            event.trigger()
          }
          window.addEventListener('popstate', this._internal)
        }
      },
      remove: {
        popstate () {
          window.removeEventListener('popstate', this._internal)
        }
      }
    },
    $type: 'string',
    href: {
      inject: [
        require('../../../lib/operator/type'),
        require('../../../lib/operator/transform')
      ],
      $transform () {
        return global.location.href
      },
      $type: 'string',
      properties: {
        _internal: true
      },
      on: {
        data: {
          children (data, event) {
            // this._lastStamp = event.stamp
            this.parent.each(function (property, key) {
              if (key !== 'href') {
                property.emit('data', data, event)
              }
            })
          }
        }
      }
    },
    ChildConstructor: new Observable({
      inject: require('../../../lib/operator/type'),
      define: {
        match: {
          get () {
            if (!this._match) {
              let separator = this.separator
              if (separator === '/') {
                separator = '\\/'
              }
              let indicator = this.indicator
              let border = this.border.val
              this._match = new RegExp('\[' + indicator + separator + ']' + this.key + '=(([a-zA-Z/$\\d])[^' + separator + border + ']*)')
            }
            return this._match
          }
        },
        push (parsed) {
          let len = parsed.length - 1
          if (parsed[len] === this.indicator) {
            parsed = parsed.slice(0, len)
            console.log('!@#!@#!@#', parsed)
          }
          if (parsed[len] === this.separator) {
            parsed = parsed.slice(0, len)
          }
          console.error('NO!!!', parsed)
          global.history.pushState(null, null, parsed)
        }
      },
      properties: {
        separator: true,
        indicator: true
      },
      separator: '&',
      indicator: '?',
      border: function () {
        if (this.parent.indicator === '?') {
          return '#'
        } else {
          return '?'
        }
      },
      $type: 'string',
      on: {
        data: {
          condition (val, next, event, data) {
            if (this.key) {
              let url = this.parent.href.val
              let match = url && url.match(this.match)
              let result

              if (match) {
                result = match[1]
              }

              if ((val || val === '' || val === null) && event.inherits && event.inherits.type !== 'popstate') {
                let newval
                let piv
                let clearit
                let remover

                if (result) {
                  piv = match[0]

                  if (piv) {
                    if (piv[0] == this.indicator) {
                      clearit = true
                      piv = piv.slice(1)
                    }
                  }

                  if (val) {
                    newval = piv.replace(result, val)
                  } else {
                    remover = true
                    newval = ''
                  }
                }
                if (newval === void 0) {
                  if (val) {
                    let index = url.indexOf(this.indicator)
                    if (index > 0) {
                      newval = url.slice(0, index + 1) + this.key + '=' + val + this.separator + url.slice(index + 1)
                    } else {
                      newval = url + this.indicator + this.key + '=' + val
                    }

                    if (newval !== url) {
                      this.push(newval)
                    }
                  }
                } else {
                  let parsed
                  if (url.indexOf(piv + this.separator) > -1 && clearit && remover) {
                    parsed = url.replace(piv + this.separator, newval)
                  } else {
                    parsed = url.replace(piv, newval)
                  }

                  if (parsed !== url) {
                    this.push(parsed)
                  }
                }
                result = val
              }

              if (result) {
                console.log('here?', this.output, result, result, 'vs', this.val)
                // event.inherits && event.inherits.type === 'popstate' &&
                if (result === this.output) {
                  console.log('block it!')
                  // next(true)
                  return
                }
                val = result
              } else if (this.output) {
                val = ''
              } else {
                // next(true)
                return
              }

              // ouput or changing the actual origin lets think about it!
              this.output = val
              this.parent.emit('url', val, event)

              // this.origin.set(val, event)
              console.log('should fire', event.removed, event.inherits, event.queue)
              next()
            }
            return
          }
        }
      }
    })
  })

  global.rick = new theUrl.Constructor()

  // if 5 or 2

  // // rick.val = 'http://xxxx.com/bla/?creepin=rick'
  // rick.val = 'http://xxxx.com/bla/?creepin=rick&james=bla'
  // rick.val = 'haha.com'
  // console.log('HEY HEY HEY HEY'.magenta)
  // rick.val = 'haha.com/xxxx'
  // console.log('HEY HEY HEY HEY'.cyan)
  // // rick.val = 'http://xxxx.com/bla/?creepin='

  var a = global.bla = new Observable({
    val: 'yo'
  })

  var b = global.bla2 = new Observable('yo2')

  // rick.creepin.val = a
  rick.set({
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

  console.log('http://🍕💩.ws/😸👓/'.toString())


  // rick.val = '/bla/?creepin=#'
  // console.log('HEY HEY HEY HEY'.blue)

  // rick.creepin.val = 'yobitchez'

  // console.log('HEY HEY HEY HEY'.magenta)

  // rick.val = '/bla/?creepin=blurfs'

  // console.log('HEY HEY HEY HEY'.blue)

  // rick.creepin.val = 'yobitchez2'

  // window.location.hash = 'xsss'

  // rick.href.val = window.location.href //'/bla/?creepin=blurfs'
  // console.clear()
  // console.log('HEY HEY HEY HEY'.blue, window.location.href)

  // b.val = 'xxx'

  // console.clear()
  // console.log('HEY HEY HEY HEY'.blue, window.location.href)
  // rick.no.remove()

  // a.remove()

  // rick.creepin.val = 'yobitchez2'

  // console.log('HEY HEY HEY HEY beurs'.blue, window.location.href)

  // rick._input = window.location.href

  // rick.burs.val = 'yobitchez3'

  // rick._input = window.location.href


})


// bla
// popup  /     /  ? the next key? wtf?


/*
properties: {
  _internal: true
},
on: {
  data: {
    children (data, event) {
      this.each(function (property) {
        property.emit('data', data, event)
      })
    }
  },
  new: {
    popstate () {
      this._internal = () => {
        var event = new Event(this, 'popstate')
        event.isTriggered = true
        var val = this.val
        this.emit('data', val, event)
        event.trigger()
      }
      window.addEventListener('popstate', this._internal)
    }
  },
  remove: {
    popstate () {
      window.removeEventListener('popstate', this._internal)
    }
  }
},

$transform (val) {
  return global.location.href
},
 */
