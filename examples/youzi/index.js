var log = require('../../lib/util/log')
var perf = require('../../lib/util/perf')
//-------------------------------------------------------------

var Base = require('../../lib/base')

var define = Object.defineProperty
// /**
//  * Returns the value of base object
//  * @memberOf Base#
//  * @name  $selection
//  * @type {*}
//  */
// define( proto , '$selection', {
//   get:function() {
//     return this._$selection
//   },
//   set:function( val ) {
//     this.$filter()
//   }
// })

// proto.$flags = {
//   $selection: function(selection) {
//     this._$selection = selection
//   }
// }


var blurf = new Base({
  a: {
    testField:{
      thing:true,
      testField:{
        thing:false,
          testField:{
          thing:true,
          testField:{
            thing:false
          }
        }
      }
    },
    b: {
      testField:{
        nope:true,
        testField2:{
          thing2:'smurp'
        }
      },
      c: {
        testField:true,
        $val:function() {
          //easy notation for this shit e.g.
          //$parent(3).
          return this.$val
        }
      }
    },
    b2:{
      testField2:{
        thing2:'lurf'
      }
    }
  },
  c:{
    testField:{
      haha:'blur'
    }
  },
  d:{

  }
})

// blurf.$val = 'moooi'


console.log('--------------------------------------')

log('blurf filter',blurf.$filter(function( result ){
  return true
}))

log('blurf',blurf)
// log("blurf.$find('c')", blurf.$find('c.testField',{results:new Base()}))

// perf({
//   log:log,
//   method:function() {
//     var fn = function(){}
//     for(var i = 0; i < 300000000; i++) {

//     }
//   }
// })

//-----------------------------------------------------------------

var Selection = new Base({

}).$Constructor

define( Selection.prototype , '$filter', {
  value:function( options ){
    if(options === void 0){
      options = {}
    }
    options.results = this
    return Base.prototype.$filter.call(this._$val, options)
  }
})

var searchableBlurf = new Selection(blurf)

log('searchableBlurf filter',searchableBlurf.$filter(function( result ){
  if(result._$key === 'a') return true
}))

log('searchableBlurf after filter', searchableBlurf)