
var Emitter = require('../../lib/emitter')

var Observable = require('../../lib/observable')

var On = require('../../lib/observable/onConstructor')

var DOMEVENTS = {}

var cnt = 0

var Event = require('../../lib/event')
Event.prototype.inject( require('../../lib/event/toString' ))

//--------events----------

var DomEmitter = new Emitter({
  $define: {
    _$key: {
      set:function(val) {
        if(!DOMEVENTS[val]) {
          console.error( 'should add to dom event' , val )
          document.body.addEventListener( val, function(e) {
            e.$stamp = (++cnt)
            var event

            if(e.target.$base) {
              if(e.target.$base.$on && e.target.$base.$on[val] ) {
                if(!event) {
                  event = new Event( e.target.$base )
                  event.domEvent = e
                }
                e.target.$base.$emit( val, event, e )
              }
            }

          })
          DOMEVENTS[val] = true
        }
        this.__$key = val
      },
      get:function(val) {
        return this.__$key
      }
    }
  }
}).$Constructor

//------element---------

var Element

var element = new Observable({
  $define: {
    $node: {
      get:function() {
        if(!this._$node)  {
          this._$node = document.createElement( 'div' )
          this._$node.$base = this
          this._$node.style.border = '40px solid orange'
          this._$node.style.marginTop = '5px'
          this._$node.style.background = '#eee'
          this._$node.style.padding = '10px'
        }
        return this._$node
      }
    }
  },
  $flags: {
    $node:function( val ) {
      this._$node = val
      this._$node.$base = this
      this._$nodeSet = true
    },
    $on: new On({
      $define: {
        $ChildConstructor: DomEmitter
      }
    })
  },
  $useVal:true,
  $on: {
    $new: function( event, meta ) {
      if(this._$node && !this._$nodeSet ) {
        console.error('NEW ???', this.$path, meta.$path, this._$node)
        this._$node = this._$node.cloneNode(true)
        this._$node.$base = this
      }
    },
    $addToParent: function( event, meta ) {
      console.error('parent --- XXX')
      if(this._$parent && this instanceof Element) {
        console.log('??!@#', this._$parent.$node)
        this._$parent.$node.appendChild( this.$node )
      }
    }
  }
})

Element = element.$Constructor

element.define({
  $ChildConstructor: Element
})

// Element = new Element().$Constructor

//--------properties----------

var Border = new Observable({ 
  $useVal:true,
  $on: { 
    $change: function( event ) {
      console.error('\n\n\n\n\nblarf border', this.$val)
      if(this._$parent && this.$parent) {
        this.$parent.$node.style.border = this.$val
      } 
    }
  }
}).$Constructor

element.$flags = {
  $border: function(val, event) {     
    if(!this.$border) {
      this.$setKeyInternal( '$border', new Border(), false)
    }
    //TODO: event moet hier
    this.$border.$set(val)
  } 
}

//-------- example implementation----------

var app = new Element({
  $key:'app',
  $node: document.body
})

var aa = new Element()

aa.define({
  $node: {
    get:function() {
     if(!this._$node)  {
        this._$node = document.createElement( 'div' )
        this._$node.$base = this
        this._$node.style.border = '4px solid purple'
        this._$node.style.background = 'pink'
        this._$node.style.padding = '4px'
        this._$node.style.borderRadius = '50%'
      }
      return this._$node
    }
  },
  $ChildConstructor: aa.$Constructor
})

// aa.$node.style.borderRadius = '50%'
// aa.$node.style.padding = '10px'

var extraSpesh = new aa.$Constructor({
  a: {
    b: {
      c: {
        d:{}
      }
    }
  }
})


app.$set({
  yuzi: {
    $border:'10px solid blue',
    $on: {
      click:function() {
        this.$node.style.opacity = Math.random()
      }
    },
    blurf:{
      // $border:'10px solid blue',
      blaps:{
        bloeps: {
          blurf:{},
            smuts: new extraSpesh.$Constructor()
        }
      }
    }
  },
  james: true,
  xx: new extraSpesh.$Constructor(),
  yy: new extraSpesh.$Constructor()
})

app.$node.style.border = '1px solid black'

// var X = new Element({
//   $border:'20px solid blue',
//   $on: {
//     click:function() {
//       console.log(this.$path)
//       console.log(this._$parent)
//     }
//   }
// }).$Constructor

// app.$set({
//   y: {
//     // $border:'10px solid blue',
//     $on: {
//       mousemove:function() {
//         this.$node.style.opacity = Math.random()
//       }
//     }
//   },
//   xxxxxx:new X(),
//   yyy:new X(),
//   zzz:new X(),
//   xy:{
//     // $border:'10px solid red',
//     $on: {
//       click: function() {
//         this.$node.style.opacity = Math.random()
//       }
//     },
//     blurf: {
//       // $border:'200px solid red',
//       $on: {
//         click: function() {
//           this.$node.style.marginTop = Math.random()*99+'px'
//         }
//       }
//     }
//   }
// })

// app.$set({
//   x:{
//     // $border:'100px solid pruple',
//     $on: {
//       click: function() {
//         this.$node.style.opacity = Math.random()
//       }
//     }
//   }
// })

// console.log( '?', app.xxxxxx._$parent )

// console.log( app.xxx)

// app.hhh.$border.$val = '10px solid blue'

/*
this._node = node.cloneNode(true); //especialy good to do for memory (also saves 20% on cpu)
*/