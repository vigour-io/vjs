describe('instances', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(done, 1000)
          },
          val: function () {
            cnt++
            if (cnt === 2) {
              done()
            }
          }
        }
      }
    })
    var b = new a.Constructor()
    a.val = 'a change!'
    // fire for b and a
  })
})

describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      key:'a',
      time: 200,
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(done, this.time.val)
          },
          val: function () {
            console.log('????', this.path)
            cnt++
            if (cnt === 3) {
              done()
            }
          }
        }
      }
    })

    //ways set all queed? how to do

    // prob best to do condition per bind
    // then share stuff later (when same etc)
    //

    //also support condition in on syntx
    // on('data', fn, condition) //conditions per fn instead of emitter?
    //that is pretty wild
    // needs a very easy subscribe
    // basicly you always want to listen to all properties for a condtion
    // when you set bind takes this into account in subscription!
    var b = new a.Constructor({time: 300})
    var c = new b.Constructor({time: 500})
    a.val = 'a change!'
    // ignore all that are not part of this chain
    // same for all normal events
    // fire for b and a
  })
})

//contet a a' a''      -- sharen a.data kan zo zijn dat de value different is

// dit betekent dat we eerst de value getter gaan runnen
// als de val hetzelfde is van de input (however the fuck were going to figure that out)
// dan shared ie met zn corresponding value hash


/*
  few things

  input val moet worden gecomminicate
  -- dit het total input object wat / val wat responsible is

  hoe doe je deze?

  2 opties
  - 1 je moet een result obj ervan maken in condition
  // dit obj word gestringified en hashed
  // dit obj word ge cross checked met je instances etc (most efficient)

  // zou hetzelfde system moeten usen als de normale operator check

  // idee word dan dat operators val get goed werkt met context / instances

  // als we dat kunnen unifyen hebben we een sluitend systeem



  var a = new obs({
    input: {
      $type: 'string'
    },
    $transform: String.toUpperCase,
    on: {
      data: {
        condition: function(data) {
          //parsed for before
          http.get(data)
        }
      }
    }
  })


  //operators hebben defaults voor input or ouput
  //this is all very specific for the on data condition...
  //e.g subsandbind operator is by default input
  //transform default is output

  var a = new obs({
    input: {
      $type: 'string'
    },
    output: {
      $transform: String.toUpperCase,
    }
    on: {
      data: {
        condition: function(data, done) {
          http.get(data, done)
          //does this.input (parses input)
        }
      }
    }
  })

  var a = new obs({
    $type:'string',
    $transform: String.toUpperCase,
    on: {
      data: {
        condition: {
          // default data condtion gets is .val (parsed of data)
          $type:'string',
          val: function(data) {
            http.get(data) (something like that)
          }
        }
      },
      new: {
        condition: {
          // check the data by default pass this with new
          $instanceof: Spesh,
          val: function(data) {
            http.get(data) (something like that)
          }
        }
      }
    }
  })

  //mesh -- best since we have a format for $subs and data now for example
  var a = new obs({
    $input: {
      $type: 'string'
    },
    $transform: String.toUpperCase,
    on: {
      data: {
        condition: {
          // default data condtion gets is .val (parsed of data)
          $type:'string',
          val: function(data) {
            http.get(data) (something like that)
          }
        }
      },
      new: {
        condition: {
          // check the data by default pass this with new
          $instanceof: Spesh,
          val: function(data) {
            http.get(data) (something like that)
          }
        }
      }
    }
  })

//returning void 0 in an operator will cancel all others or something

var a = new Observable({
  $data: 'path',
  on: {
    data: {
      condition: {
        $type:'string',
        //condition: fn .... load some metadata
      }
    }
  }
})

*/
